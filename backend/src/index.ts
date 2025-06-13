import express, { Request, Response } from "express";
import cors from "cors";
import { auth } from './middlewares/auth';
import path from "path";

import 'dotenv/config'

import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build directory
const frontendPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// API Routes
app.get("/check", (req: Request, res: Response) => {
  res.json({ message: "API running" });
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', auth, taskRoutes); // Protected task routes

// Catch-all route to serve index.html for React client-side routing
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

// connect to prisma
prisma.$connect()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log("Server running on port", PORT));
  })
  .catch((error: Error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

process.on('SIGINT', () => prisma.$disconnect().then(() => process.exit(0)));

