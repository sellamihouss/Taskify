import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials, User } from '../../types/auth';
import { authService } from '../../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      onLogin(response.user);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form className="space-y-6 max-w-md mx-auto mt-20" onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}
      <div className="space-y-4">
        {/* <p className="text-xs font-small text-gray-900">Login</p> */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          don't have an account? register
        </button>
      </div>
    </form>
  );
};

export default Login; 