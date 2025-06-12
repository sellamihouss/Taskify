# Taskify

A modern task management application built with a React frontend and Node.js backend.

## Setup Instructions


### Database Setup
1. Install PostgreSQL on your system if not already installed
2. Create a new PostgreSQL database:
   ```bash
   createdb taskify
   ```
3. Install Prisma CLI globally:
   ```bash
   npm install -g prisma
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/taskify'
   JWT_SECRET='your-secret-key'
   ```
4. Initialize Prisma and create database tables:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Key Design Decisions

### Architecture
- **Frontend-Backend Separation**: The application follows a clear separation between frontend and backend services, allowing for independent scaling and maintenance.
- **RESTful API**: The backend implements RESTful principles for clear and consistent API endpoints.
- **JWT Authentication**: Secure user authentication using JSON Web Tokens for stateless authentication.

### Frontend
- **React**: Chosen for its component-based architecture and efficient rendering.
- **Tailwind CSS**: Used for styling 
  - Responsive design

- **React Query**: Implemented for efficient server state management.
  - Automatic background refetching
  - Cache management
  - Error handling and retry logic
  - State management

- **Responsive Design**: Mobile-first approach ensuring the application works well on all devices.

### Backend
- **Node.js & Express**: Selected for their non-blocking I/O and efficient handling of concurrent requests.
- **PostgreSQL**: Chosen as the primary database for its reliability and robust feature set.
- **Prisma ORM**: Used for type-safe database access and migrations.
- **Middleware Architecture**: Implemented for request processing, authentication

### Security
- **Environment Variables**: Sensitive configuration stored in environment variables.
- **Password Hashing**: Secure password storage using bcrypt.
- **Input Validation**: Comprehensive validation on both frontend and backend.
- **CORS**: Properly configured for secure cross-origin requests.

### Performance

- **Caching**: Strategic caching of frequently accessed data.
- **Optimized Queries**: Database queries optimized for performance using Prisma's query engine.

### Database Management
- **Prisma Migrations**: Used for version-controlled database schema changes.
- **Type Safety**: Prisma provides type-safe database queries and schema definitions.

### State Management
- **React Query**: Used for server state management with features like:
  - Automatic background refetching
  - Cache invalidation
  - Optimistic updates

## Project Architecture

```
Taskify/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── utils/          # Utility functions
│   │   ├── validations/    # Form validation schemas
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── dist/               # Production build output
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   ├── services/       # Service layer
│   │   ├── utils/          # Utility functions
│   │   └── generated/      # Generated Prisma client
│   └── prisma/             # Database schema and migrations
│
└── README.md               # Project documentation
```

### Directory Structure Details

#### Frontend (`/frontend`)
- **components/**: Reusable UI components
  - `tasks/`: Task-related components
  - `auth/`: Authentication components
  - `layout/`: Layout components
- **pages/**: Page-level components
- **hooks/**: Custom React hooks for shared logic
- **services/**: API integration and data fetching
- **utils/**: Helper functions and constants
- **validations/**: Form validation schemas using Zod
- **types/**: TypeScript interfaces and types

#### Backend (`/backend`)
- **routes/**: Express route definitions
  - `taskRoutes.ts`: Task-related endpoints
  - `userRoutes.ts`: User-related endpoints
- **controllers/**: Request handlers and business logic
- **middlewares/**: Express middleware functions
  - `auth.ts`: Authentication middleware
- **services/**: Business logic and data processing
- **utils/**: Helper functions and utilities
- **generated/**: Prisma client and generated types
- **prisma/**: Database schema and migrations
  - `schema.prisma`: Database schema definition
  - `migrations/`: Database migration files

### Key Files
- `frontend/src/App.tsx`: Main React application component
- `frontend/src/main.tsx`: Application entry point
- `backend/src/index.ts`: Express server entry point
- `backend/prisma/schema.prisma`: Database schema
- `.env`: Environment configuration files

### Build Process

```
Taskify/
├── frontend/
│   ├── dist/               # Production build output
│   │   ├── assets/        # Compiled and optimized assets
│   │   │   ├── js/       # JavaScript bundles
│   │   │   ├── css/      # CSS files
│   │   │   └── images/   # Optimized images
│   │   ├── index.html    # Entry HTML file
│   │   └── favicon.ico   # Site favicon
│   │
│   └── build/            # Development build output
│
├── backend/
│   ├── dist/             # Compiled TypeScript output
│   │   ├── src/         # Compiled source files
│   │   └── index.js     # Entry point
│   │
│   └── build/           # Development build output
│
└── node_modules/        # Dependencies
```

### Build Scripts

#### Frontend Build
```bash
# Development
npm run dev

# Production Build
npm run build
```

#### Backend Build
```bash
# Development
npm run start

# Production Build
npm run build
npm run start:prod
```

### Deployment Architecture

```
Production Environment
├── Web Server (e.g., Nginx)
│   ├── Static Files
│   │   └── frontend/dist/
│   │
│   └── Reverse Proxy
│       └── Backend API (Node.js)
│
├── Database (PostgreSQL)
│   └── Prisma Migrations
│
└── Environment Configuration
    ├── .env.production
    └── .env.development
```

### Build Pipeline

1. **Frontend Build Process**
   - TypeScript compilation
   - Asset optimization
   - CSS processing
   - Code splitting
   - Environment variable injection
   - Production minification

2. **Backend Build Process**
   - TypeScript compilation
   - Prisma client generation
   - Environment configuration
   - Production optimization

3. **Deployment Steps**
   - Build frontend assets
   - Compile backend code
   - Run database migrations
   - Configure environment variables
   - Start production server

### Production Considerations

- **Environment Variables**
  ```
  # Frontend (.env.production)
  VITE_API_URL=https://api.yourdomain.com
  VITE_ENV=production

  # Backend (.env.production)
  NODE_ENV=production
  PORT=3000
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  ```

- **Security Headers**
  - CORS configuration
  - Content Security Policy
  - Rate limiting
  - SSL/TLS configuration

- **Performance Optimization**
  - Static file caching
  - API response caching
  - Database query optimization
  - Asset compression

- **Monitoring**
  - Error logging
  - Performance metrics
  - Database monitoring
  - API usage statistics



