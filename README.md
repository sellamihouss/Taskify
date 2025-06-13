# Taskify

A modern task management application built with a React frontend and Node.js backend.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Vite** - Build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Project Structure

```
Taskify/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── services/       # API service functions
│   │   ├── validations/    # Form validation schemas
│   │   ├── types/          # TypeScript type definitions
│   │   ├── contexts/       # React context providers
│   │   └── assets/         # Static assets
│   ├── public/             # Public static files
│   └── dist/               # Production build output
│
├── backend/                # Node.js backend application
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── controllers/    # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   ├── validations/    # data type validation
│   │   └── interfaces/          # TypeScript interfaces
│   └── prisma/             # Database schema and migrations
│
└── README.md               # Project documentation
```

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm package manager

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/taskify"

# Authentication
JWT_SECRET='your-secret-key'

```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

```

### Setup Process

1. **Clone the repository**
   ```bash
   git clone https://github.com/sellamihouss/Taskify
   cd taskify
   ```

2. **Database Setup**
   ```bash
   # Install PostgreSQL if not already installed
   # Create database
   createdb taskify
   ```

3. **Backend Setup**
   ```bash
   # Set up environment variables
   cp .env.example .env

   # Edit .env with your configuration
   
   # Install dependencies
   npm install

   
   # Start development server
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env

   # Edit .env with your configuration
   
   # Start development server
   npm run dev
   ```

### Development Workflow



**Database Migrations**
   ```bash
   npm run prisma:migrate
   ```


## API Documentation

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



##### Which stretch goals were achieved
- **monoRepo**
- **deployment**



##### What was the hardest part ?
- **learning TS**
- **managing to implement some required technologies that i dont have prior experience with in a short time**
- **deploying the project**

