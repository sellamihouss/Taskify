import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/auth';
import { LoginForm } from './LoginForm';
import { useLogin } from '../../services/queries';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const login = useLogin();

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    setError('');
    try {
      const response = await login.mutateAsync(credentials);
      localStorage.setItem('token', response.token);
      onLogin(response.user);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Welcome back, legend... of procrastination</h1>
      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <LoginForm onSubmit={handleSubmit} isLoading={login.isPending} />
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          don't have an account? register
        </button>
      </div>
    </div>
  );
};

export default Login; 