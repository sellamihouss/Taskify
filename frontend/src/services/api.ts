import axios from 'axios';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';
import type { Task } from '../types/task';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/users/register', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/users/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async () => {
    const { data } = await api.get('/users/profile');
     //TODO: ADD TOKEN 
    return data;
  },
};

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const { data } = await api.get<Task[]>('/tasks');
    return data;
  },

  createTask: async (task: Omit<Task, 'id' | 'user'>): Promise<Task> => {
    const { data } = await api.post<Task>('/tasks', task);
    return data;
  },

  updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
    const { data } = await api.put<Task>(`/tasks/${id}`, task);
    return data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
}; 