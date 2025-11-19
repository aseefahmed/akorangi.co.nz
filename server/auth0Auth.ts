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
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
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

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN!,
      clientID: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      callbackURL: "/api/callback",
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

  passport.use(strategy);

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  app.get("/api/login", passport.authenticate("auth0", {
    scope: "openid email profile",
  }));

  app.get("/api/callback", 
    passport.authenticate("auth0", {
      failureRedirect: "/api/login",
    }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      const returnTo = `${req.protocol}://${req.get("host")}`;
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
