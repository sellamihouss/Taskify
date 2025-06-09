import { AuthRequest } from './auth.interface';

export interface CreateTaskRequest extends AuthRequest {
  body: {
    title: string;
    description?: string;
    status: string;
    dueDate: string;
    priority: string;
    userId: string;
  };
}

export interface UpdateTaskRequest extends AuthRequest {
  params: {
    id: string;
  };
  body: {
    title?: string;
    description?: string;
    status?: string;
    dueDate?: string;
    priority?: string;
  };
}

export interface TaskIdRequest extends AuthRequest {
  params: {
    id: string;
  };
} 