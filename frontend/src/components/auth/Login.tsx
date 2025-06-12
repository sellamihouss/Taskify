import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLogin } from '../../services/queries';
import { LoginForm } from './LoginForm';

const Login: FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const login = useLogin();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (credentials: { email: string; password: string }) => {
    setError('');
    try {
      const response = await login.mutateAsync(credentials);
      setUser(response.user);
      localStorage.setItem('token', response.token);
      navigate('/', { replace: true });
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
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
        
        </div>
        <LoginForm onSubmit={handleSubmit}  isLoading={login.isPending} />
      </div>
    </div>
         <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          don't have an account? register
        </button>
    </div>
  );
};

export default Login; 