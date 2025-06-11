import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Login schema only validates email format
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
}); 