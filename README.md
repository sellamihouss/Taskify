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
│   │   ├── services/       # API service functions
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
│   │   └── generated/      # Generated Prisma client
│   └── prisma/             # Database schema and migrations
│
└── README.md               # Project documentation
```




### API Documentation

#### Authentication Endpoints

##### POST /api/users/register
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: JWT token and user data

##### POST /api/users/login
- **Description**: Login existing user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: JWT token and user data




#### Task Endpoints

##### GET /api/tasks
- **Description**: Get all tasks for authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of task objects

##### POST /api/tasks
- **Description**: Create a new task
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "Task title",
    "description": "optional",
    "status": "todo",
    "dueDate": "2024-06-22T00:00:00Z",
    "priority": "high",
    "userId": "user_id"
  }
  ```
- **Response**: Created task object

##### PUT /api/tasks/:id
- **Description**: Update an existing task
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as POST /api/tasks
- **Response**: Updated task object

##### DELETE /api/tasks/:id
- **Description**: Delete a task
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

