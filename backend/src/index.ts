import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";
import 'dotenv/config'


import userRoutes from './routes/userRoutes';



const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.get("/check", (req: Request, res: Response) => {
  res.json({ message: "API running" });
});

app.use('/api/users', userRoutes);



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

