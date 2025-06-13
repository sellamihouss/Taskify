import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterRequest, LoginRequest } from '../interfaces/user.interface';
import { AuthRequest } from '../interfaces/auth.interface';
import { registerSchema, loginSchema } from '../validations/user.validation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// create a new user
export const register = async (req: RegisterRequest, res: Response) => {
  try {
    const validationResult = registerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
       res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
      return
    }

    const { email, password } = validationResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
       res.status(400).json({ error: 'Email already registered' });
       return
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to register user' });
  }
};

// Login user
export const login = async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
       res.status(401).json({ 
        error: 'Wrong password'
      });
      return
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
       res.status(401).json({ 
        error: 'Wrong password'
      });
      return
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get current user 
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       res.status(401).json({ error: 'User not authenticated' });
       return
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        tasks: true
      }
    });

    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}; 