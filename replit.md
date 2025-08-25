# PropertyHub - Real Estate Listing Platform

## Overview

PropertyHub is a full-stack real estate listing platform built with React and Express. The application provides a public-facing website for browsing property listings and an admin dashboard for managing listings. Users can search and filter properties, view detailed information with image galleries, and contact property owners. Administrators can create, edit, and delete listings through a protected dashboard interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for client-side navigation with minimal bundle size
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation for type-safe forms
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Pattern**: REST API with JSON responses
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Middleware**: Request logging, JSON parsing, and CORS handling

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage with sample data for rapid development
- **Production Ready**: Database credentials configured via environment variables

### Authentication and Authorization
- **Strategy**: Simple username/password authentication
- **Session Management**: Local storage for client-side session persistence
- **Route Protection**: Client-side route guards for admin dashboard access
- **Default Credentials**: Admin/password for development simplicity

### External Dependencies
- **Database Provider**: Neon Database (PostgreSQL serverless)
- **Image Handling**: Base64 encoding or external URLs for property images
- **Development Tools**: 
  - Replit integration for cloud development
  - Hot module replacement for fast development cycles
  - TypeScript compilation and type checking

### Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Component Composition**: Reusable UI components with proper prop interfaces
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Radix UI primitives ensure ARIA compliance and keyboard navigation

### API Structure
- `GET /api/listings` - Retrieve all property listings
- `GET /api/listings/:id` - Get specific listing details
- `POST /api/listings` - Create new listing (admin only)
- `PUT /api/listings/:id` - Update existing listing (admin only)
- `DELETE /api/listings/:id` - Remove listing (admin only)
- `GET /api/listings/search/:query` - Search listings by keywords
- `POST /api/auth/login` - Administrator authentication
- `POST /api/contact` - Contact form submissions