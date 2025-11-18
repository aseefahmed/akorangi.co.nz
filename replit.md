# SmartLearn NZ - Interactive AI Education Platform

## Overview

SmartLearn NZ is an AI-powered educational platform designed for New Zealand children (Years 1-8). The application provides personalized practice questions for mathematics and English, aligned with the New Zealand curriculum. It features gamification elements including points, achievements, streaks, and real-time feedback to make learning engaging and fun for children.

The platform uses OpenAI's GPT-5 model to dynamically generate curriculum-aligned questions, providing adaptive learning experiences that automatically adjust difficulty based on student performance (85%+ accuracy increases difficulty, 40% or less decreases difficulty).

Parents and teachers can monitor student progress through dedicated dashboards showing subject-specific statistics, accuracy trends, and adaptive difficulty levels.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- React Query (@tanstack/react-query) for server state management and data fetching

**UI Component System**
- shadcn/ui component library (Radix UI primitives with custom styling)
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows child-friendly principles with rounded fonts (Fredoka, Nunito, Inter)
- Custom color palette optimized for educational content with light/dark theme support
- Gamification elements including confetti animations (canvas-confetti) for achievements

**State Management**
- React Query handles all server state (user data, practice sessions, achievements)
- Local component state using React hooks
- Theme state managed via Context API with localStorage persistence
- Session state managed server-side via express-session

### Backend Architecture

**Server Framework**
- Express.js for RESTful API endpoints
- TypeScript for type safety across the entire stack
- Session-based authentication using Replit Auth (OpenID Connect)

**API Design**
- RESTful endpoints organized by domain (auth, practice sessions, achievements)
- Centralized route registration in `server/routes.ts`
- Middleware for authentication, request logging, and JSON parsing
- Error handling with appropriate HTTP status codes

**Business Logic Layers**
- `server/storage.ts`: Data access layer abstracting database operations
- `server/openai.ts`: AI service layer for question generation and answer validation
- `server/seed.ts`: Database initialization and achievement setup

### Database Architecture

**ORM & Schema Management**
- Drizzle ORM for type-safe database queries
- PostgreSQL via Neon serverless driver (optimized for edge deployments)
- Schema-first approach with Zod validation integration
- Migrations managed through drizzle-kit

**Data Models**
- **users**: Student/parent/teacher profiles with role differentiation, year level (students), points, streaks, and adaptive difficulty tracking
- **studentLinks**: Connections between parents/teachers (supervisors) and students with approval workflow
- **practiceSessions**: Individual learning sessions with subject, duration, and performance metrics
- **sessionQuestions**: Individual questions within sessions with answers and feedback
- **achievements**: Predefined achievement definitions (badges, milestones)
- **userAchievements**: Many-to-many relationship tracking unlocked achievements
- **sessions**: Server-side session storage for Replit Auth

**Key Design Decisions**
- Denormalized user stats (totalPoints, currentStreak) for performance
- Session questions stored separately for detailed analytics
- Achievement system uses category-based requirements for flexible unlocking logic
- Role-based access with student/parent/teacher differentiation
- Student-supervisor linking system with approval workflow for data privacy
- Adaptive difficulty system tracks per-subject difficulty levels (easy/medium/hard) and recent accuracy percentages

### Authentication & Authorization

**Authentication Provider**
- Replit Auth via OpenID Connect (OIDC) protocol
- Passport.js strategy for session management
- Automatic token refresh handling

**Session Management**
- PostgreSQL-backed sessions via connect-pg-simple
- 7-day session duration with secure HTTP-only cookies
- Session state synchronized with user claims and access tokens

**Authorization Pattern**
- `isAuthenticated` middleware protects all API routes requiring user context
- User ID extracted from session claims for data scoping
- Automatic redirect to login on 401 responses

### AI Integration

**OpenAI GPT-5 Integration**
- Structured JSON outputs using `response_format: { type: "json_object" }`
- System prompt defines role as "New Zealand primary school teacher"
- Question generation parameterized by subject, year level, and optional topic
- Answer validation provides feedback and correctness assessment

**Prompt Engineering Strategy**
- Curriculum alignment explicitly required in prompts
- Age-appropriate language and engaging content emphasized
- Difficulty levels (easy, medium, hard) for adaptive learning
- Topic extraction for progress tracking and analytics

### Performance Optimizations

**Frontend**
- React Query caching with infinite stale time for stable data
- Memoization of expensive computations
- Skeleton loading states for improved perceived performance
- Responsive images and lazy loading

**Backend**
- OIDC configuration memoization (1-hour cache)
- Database connection pooling via Neon
- Efficient query patterns with Drizzle ORM
- Request logging for monitoring and debugging

## External Dependencies

### Third-Party Services
- **OpenAI API**: GPT-5 model for AI-powered question generation and answer validation
- **Replit Auth**: OpenID Connect authentication provider (issuer: replit.com/oidc)
- **Neon Database**: Serverless PostgreSQL hosting via WebSocket connections

### Core Libraries
- **UI Components**: Radix UI primitives (@radix-ui/*) for accessible, unstyled components
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Charts**: Recharts for progress visualization and analytics
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Type Safety**: TypeScript with strict mode enabled
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Development**: tsx for TypeScript execution, nodemon-like hot reload

### Authentication & Session
- **Authentication**: openid-client and passport for OIDC flow
- **Sessions**: express-session with connect-pg-simple for PostgreSQL storage
- **Security**: Memoizee for secure configuration caching

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `SESSION_SECRET`: Encryption key for session cookies
- `ISSUER_URL`: OIDC provider URL (defaults to Replit)
- `REPL_ID`: Replit application identifier