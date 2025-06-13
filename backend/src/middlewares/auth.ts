import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/auth.interface';

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
}; 