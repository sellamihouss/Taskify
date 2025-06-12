import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { taskService, authService } from './api';
import type { Task } from '../types/task';
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth';

// Task Queries
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (task: Omit<Task, 'id' | 'user'>) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<Task> }) =>
      taskService.updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Auth Queries
export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
  });
};

export const useProfile = (options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'> & { onError?: () => void }) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    ...options,
  });
}; 