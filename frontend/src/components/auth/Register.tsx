import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types/auth';
import { RegisterForm } from './RegisterForm';
import { useRegister } from '../../services/queries';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const register = useRegister();

  const handleSubmit = async (credentials: { email: string; password: string; confirmPassword: string }) => {
    setError('');
    try {
      const response = await register.mutateAsync(credentials);
      localStorage.setItem('token', response.token);
      onLogin(response.user);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Go ahead, register... what could possibly go wrong?</h1>
      <br />

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}
      <RegisterForm onSubmit={handleSubmit} isLoading={register.isPending} />
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
};

export default Register; 