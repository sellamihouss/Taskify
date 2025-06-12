export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Types for form data (used with React Hook Form)
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
}

// Types for API requests
export interface LoginCredentials extends LoginFormData {}

export interface RegisterCredentials extends RegisterFormData {
  confirmPassword: string;
} 