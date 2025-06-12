import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";
import { auth } from './middlewares/auth';
import path from 'path';

import 'dotenv/config'

import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

app.get("/check", (req: Request, res: Response) => {
  res.json({ message: "API running" });
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', auth, taskRoutes); // Protected task routes

// Handle React routing, return all requests to React app
app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
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

