import { z } from 'zod';
import { Status } from "@prisma/client"

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.nativeEnum(Status, {
    errorMap: () => ({ message: 'Status must be todo, inProgress, or completed' })
  }),
  dueDate: z.string()
    // .refine((date) => !isNaN(Date.parse(date)), {
    //   message: 'Invalid date format'
    // })
    // .refine((date) => new Date(date) > new Date(), {
    //   message: 'Due date must be in the future'
    // })
    ,
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  userId: z.string()
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  status: z.enum(['pending', 'inProgress', 'completed'], {
    errorMap: () => ({ message: 'Status must be todo, inProgress, or completed' })
  }).optional(),
  dueDate: z.string()
    // .refine((date) => !isNaN(Date.parse(date)), {
    //   message: 'Invalid date format'
    // })
    // .refine((date) => new Date(date) > new Date(), {
    //   message: 'Due date must be in the future'
    // }).optional()
    ,
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }).optional()
}); 