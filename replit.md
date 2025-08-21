# SabhjiGo - Vegetable Vendor PWA

## Overview

SabhjiGo is a Progressive Web Application connecting apartment societies with street vegetable vendors in Pune. The app enables real-time tracking of vendors, inventory management, and route sharing while supporting offline functionality for areas with poor connectivity. The system serves three main user roles: customers who track vendors in their societies, vendors who manage inventory and routes, and admins who oversee the platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a modern React-based architecture built with Vite for optimal performance on low-end Android devices. The frontend employs a component-based structure with shadcn/ui components for consistent design, Wouter for lightweight client-side routing, and Tailwind CSS for responsive styling. State management is handled through React Query for server state synchronization and local React state for UI interactions.

### Progressive Web App (PWA) Implementation
The app implements full PWA capabilities with a service worker for offline functionality, web app manifest for native-like installation, and IndexedDB persistence through Firestore offline support. The service worker provides cache-first strategies for static assets and fallback pages for offline scenarios, ensuring the app remains functional even with poor connectivity.

### Backend Architecture
Firebase serves as the complete backend solution with Firestore for real-time data storage and Firebase Auth for user authentication. The system supports both phone and email authentication methods. Firestore security rules enforce proper data access controls, ensuring users can only access their own data and authorized shared content.

### Data Model
The Firestore database uses six main collections:
- `users/{uid}` - User profiles with role-based access (customer/vendor/admin), consent preferences, and society associations
- `societies/{id}` - Apartment society information and metadata
- `vendors/{id}` - Vendor profiles including contact information and served societies
- `routes/{id}` - Daily vendor routes with location tracking and timestamps
- `inventories/{id}` - Vendor inventory management with pricing and availability
- `groupShares/{id}` - Public sharing functionality for vendor routes

### Authentication & Authorization
The system implements Firebase Authentication with role-based access control. Users are automatically assigned a 'customer' role on first sign-in, with vendor and admin roles managed through the admin interface. Firestore security rules enforce granular permissions, allowing users to read their own data, vendors to manage their routes and inventory, and admins to perform platform management tasks.

### Offline-First Design
The application prioritizes offline functionality through Firestore's IndexedDB persistence, service worker caching, and optimistic updates. Location tracking and inventory updates are throttled to conserve battery and data usage, with configurable time and distance thresholds for update frequency.

### Performance Optimizations
The system is optimized for low-end Android devices with minimal dependencies, efficient caching strategies, and progressive loading. Composite indexes are configured for frequently queried data patterns, and the UI uses lightweight components to ensure smooth performance on constrained devices.

## External Dependencies

### Firebase Services
- **Firebase Authentication** - Phone and email authentication with browser local persistence
- **Firestore Database** - Real-time NoSQL database with offline persistence via IndexedDB
- **Firebase Hosting** - Static asset hosting and PWA deployment (planned for production)

### UI Framework & Styling
- **React 18** - Component-based UI framework with concurrent features
- **Vite** - Fast build tool and development server optimized for modern JavaScript
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **shadcn/ui** - Pre-built component library based on Radix UI primitives

### Data & State Management
- **TanStack React Query** - Server state synchronization and caching
- **Wouter** - Lightweight client-side routing library
- **date-fns** - Date manipulation and formatting utilities

### Development & Testing
- **Firebase Rules Unit Testing** - Security rules validation and testing
- **TypeScript** - Static type checking and improved developer experience
- **PostCSS & Autoprefixer** - CSS processing and browser compatibility

### PWA & Performance
- **Workbox** (via service worker) - PWA caching strategies and offline functionality
- **Web App Manifest** - Native app-like installation and appearance
- **Font Awesome** - Icon library for consistent UI elements

### Database (Future Migration)
- **Drizzle ORM** - Type-safe database toolkit configured for PostgreSQL migration
- **Neon Database** - Serverless PostgreSQL for potential future backend migration