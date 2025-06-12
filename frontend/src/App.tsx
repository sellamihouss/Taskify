import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskList from './components/tasks/TaskList';
import { useProfile } from './services/queries';

const App: FC = () => {
  const { data: profile, isLoading } = useProfile({
    retry: false,
    onError: () => {
      localStorage.removeItem('token');
    }
  });
  const navigate = useNavigate();

  // Use profile data if available, otherwise use manual user state
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!profile) {
    navigate('/login')
    return null
  }

  return (
    <>
      <div>
          <div>
            <h1>Task Manager</h1>
          </div>
          <div className="text-right">
            <span>Welcome, {profile.email}</span>
            <button
              onClick={handleLogout}
              className="ml-2 px-2 py-1 bg-red-500 text-white"
            >
              logout
            </button>
          </div>
        </div>
      <TaskList userId={profile.id} />
    </>
  );
};

export default App;
