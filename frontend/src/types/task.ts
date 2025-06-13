import type { User } from './auth';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'inProgress' | 'completed';
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  user: User;
} 