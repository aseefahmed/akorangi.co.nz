import passport from "passport";
import { Strategy as Auth0Strategy } from "passport-auth0";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: sessionTtl,
    },
  });
}

async function upsertUser(profile: any) {
  await storage.upsertUser({
    id: profile.id,
    email: profile.emails?.[0]?.value || profile.email,
    firstName: profile.name?.givenName || profile.given_name || profile.nickname,
    lastName: profile.name?.familyName || profile.family_name || "",
    profileImageUrl: profile.picture || profile.photos?.[0]?.value,
  });
}

function getAllowedHosts(): string[] {
  const allowedHosts = process.env.ALLOWED_HOSTS?.split(',').map(h => h.trim()) || [];
  
  if (process.env.REPL_SLUG) {
    allowedHosts.push(`${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  }
  
  if (process.env.REPL_ID) {
    allowedHosts.push(`${process.env.REPL_ID}.id.repl.co`);
  }
  
  allowedHosts.push('replit.dev');
  
  if (process.env.NODE_ENV === 'development') {
    allowedHosts.push('localhost:5000');
    allowedHosts.push('127.0.0.1:5000');
  }
  
  return allowedHosts;
}

function isAllowedHost(host: string): boolean {
  const allowedHosts = getAllowedHosts();
  return allowedHosts.some(allowed => host === allowed || host.endsWith(`.${allowed}`));
}

function sanitizeProtocol(protocol: string): 'http' | 'https' {
  return protocol === 'http' || protocol === 'https' ? protocol : 'https';
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const registeredStrategies = new Map<string, string>();

  const ensureStrategy = (protocol: string, host: string) => {
    if (!isAllowedHost(host)) {
      throw new Error('Host not allowed');
    }

    const sanitizedProtocol = sanitizeProtocol(protocol);
    const strategyKey = `${sanitizedProtocol}://${host}`;
    const strategyName = `auth0:${strategyKey}`;
    const callbackURL = `${strategyKey}/api/callback`;
    
    const existingCallback = registeredStrategies.get(strategyName);
    if (existingCallback === callbackURL) {
      return;
    }

    const strategy = new Auth0Strategy(
      {
        domain: process.env.AUTH0_DOMAIN!,
        clientID: process.env.AUTH0_CLIENT_ID!,
        clientSecret: process.env.AUTH0_CLIENT_SECRET!,
        callbackURL,
      },
      async (accessToken: string, refreshToken: string, extraParams: any, profile: any, done: any) => {
        try {
          await upsertUser(profile);
          
          const user = {
            id: profile.id,
            profile,
            accessToken,
            refreshToken,
          };
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    );

    passport.use(strategyName, strategy);
    registeredStrategies.set(strategyName, callbackURL);
  };

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  app.get("/api/login", (req, res, next) => {
    try {
      const host = req.get("host")!;
      const sanitizedProtocol = sanitizeProtocol(req.protocol);
      console.log(`[Auth0] Login attempt - Host: ${host}, Protocol: ${sanitizedProtocol}`);
      console.log(`[Auth0] Allowed hosts:`, getAllowedHosts());
      console.log(`[Auth0] Is allowed:`, isAllowedHost(host));
      ensureStrategy(sanitizedProtocol, host);
      const strategyKey = `${sanitizedProtocol}://${host}`;
      passport.authenticate(`auth0:${strategyKey}`, {
        scope: "openid email profile",
      })(req, res, next);
    } catch (error) {
      console.error(`[Auth0] Login error:`, error);
      res.status(400).json({ message: 'Invalid host or protocol' });
    }
  });

  app.get("/api/callback", (req, res, next) => {
    try {
      const host = req.get("host")!;
      const sanitizedProtocol = sanitizeProtocol(req.protocol);
      ensureStrategy(sanitizedProtocol, host);
      const strategyKey = `${sanitizedProtocol}://${host}`;
      passport.authenticate(`auth0:${strategyKey}`, {
        failureRedirect: "/api/login",
      })(req, res, next);
    } catch (error) {
      res.status(400).json({ message: 'Invalid host or protocol' });
    }
  }, (req, res) => {
    res.redirect("/");
  });

  app.get("/api/logout", (req, res) => {
    const host = req.get("host")!;
    
    if (!isAllowedHost(host)) {
      return res.status(400).json({ message: 'Invalid host' });
    }
    
    req.logout(() => {
      const sanitizedProtocol = sanitizeProtocol(req.protocol);
      const returnTo = `${sanitizedProtocol}://${host}`;
      const logoutURL = `https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(returnTo)}`;
      res.redirect(logoutURL);
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
