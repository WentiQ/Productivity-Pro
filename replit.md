# ProductivePal - Full Stack Productivity Application

## Overview

ProductivePal is a comprehensive productivity application built with modern web technologies. It combines task management, time tracking, habit formation, and wellness features into a unified platform. The application follows a full-stack architecture with a React frontend and Express.js backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Development**: Hot module replacement via Vite middleware

### Project Structure
```
├── client/          # Frontend React application
├── server/          # Backend Express.js application
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Core Features
1. **Dashboard**: Central hub with productivity metrics and daily overview
2. **Task Management**: Create, organize, and track tasks with priorities and categories
3. **Calendar Events**: Schedule and manage calendar events with reminders
4. **Pomodoro Timer**: Focus sessions with customizable work/break intervals
5. **Note Taking**: Rich text editor with tagging and attachment support
6. **Water Tracking**: Daily hydration monitoring with intake logging
7. **Habit Tracking**: Build and maintain positive habits with streak tracking
8. **Distraction Blocker**: Website blocking functionality for focus enhancement
9. **Analytics**: Comprehensive productivity scoring and insights
10. **Utility Tools**: PDF manipulation, text processing, and image editing
11. **Time Pass**: Entertainment features including games and music

### Database Schema
The application uses a comprehensive PostgreSQL schema with the following main entities:
- **Users**: Authentication and user management
- **Tasks**: Task management with priorities, categories, and status tracking
- **Events**: Calendar events with timing and location data
- **Pomodoro Sessions**: Focus session tracking with type and completion status
- **Notes**: Rich text notes with tags and attachments
- **Water Intake**: Daily hydration tracking
- **Habits**: Habit definitions and tracking
- **Habit Entries**: Daily habit completion records
- **Distraction Sites**: Blocked websites configuration
- **User Settings**: Personalized application preferences

### UI/UX Design
- **Design System**: Shadcn/ui with "new-york" style
- **Theme Support**: Light/dark mode with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Component Library**: Comprehensive set of reusable UI components
- **Accessibility**: Built on Radix UI primitives for ARIA compliance

## Data Flow

### Client-Server Communication
1. **API Requests**: Centralized through `apiRequest` utility with error handling
2. **Query Management**: TanStack Query handles caching, synchronization, and optimistic updates
3. **Real-time Updates**: Automatic query invalidation on data mutations
4. **Error Handling**: Consistent error boundaries and user feedback

### State Management Pattern
1. **Server State**: Managed by TanStack Query with automatic caching
2. **Local State**: React hooks for component-specific state
3. **Form State**: React Hook Form with Zod schema validation
4. **Global State**: Minimal global state, preference for server state

### Database Operations
1. **ORM Layer**: Drizzle ORM provides type-safe database operations
2. **Schema Validation**: Drizzle-Zod integration for runtime type checking
3. **Migrations**: Version-controlled database schema changes
4. **Connection Pooling**: Neon Database handles connection management

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library with consistent design
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Notification System
- Browser Notification API integration for timer alerts and reminders
- Progressive enhancement with graceful fallbacks

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Asset Optimization**: Automatic code splitting and tree shaking
4. **Type Checking**: TypeScript compilation verification

### Production Configuration
- **Environment Variables**: Database URL and configuration via environment
- **Static Serving**: Express serves built frontend assets
- **Error Handling**: Comprehensive error boundaries and logging
- **Database Migrations**: `drizzle-kit push` for schema deployment

### Development Workflow
- **Hot Reloading**: Vite HMR for instant frontend updates
- **API Proxy**: Development server proxies API requests to Express
- **Type Safety**: Shared types between frontend and backend
- **Database**: Local development with Neon Database

### Scalability Considerations
- **Serverless Architecture**: Designed for serverless deployment
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Query-level caching with TanStack Query
- **Code Splitting**: Automatic route-based code splitting

The application is architected for maintainability, scalability, and developer experience, with strong TypeScript integration throughout the stack and a focus on modern web development best practices.