import { Request } from 'express';

export interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
} 