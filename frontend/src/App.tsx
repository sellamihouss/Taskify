import { useState } from 'react';
import type { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskList from './components/tasks/TaskList';
import { useProfile } from './services/queries';
import type { User } from './types/auth';

const App: FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const [manualUser, setManualUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Use profile data if available, otherwise use manual user state
  const user = profile || manualUser;

  const handleLogin = (userData: User) => {
    setManualUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setManualUser(null);
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    navigate('/login');
    return null;
  }

  return (
    <>
      {user && (
        <nav>
          <div>
            <div>
              <div>
                <h1>Task Manager</h1>
              </div>
              <div className="text-right">
                <span>Welcome, {user.email}</span>
                <button 
                  onClick={handleLogout}
                  className="ml-2 px-2 py-1 bg-red-500 text-white"
                >
                  logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/tasks" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/tasks" /> : <Register onLogin={handleLogin} />}
        />
        <Route
          path="/tasks"
          element={
            user ? (
              <TaskList userId={user.id} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={<Navigate to={user ? "/tasks" : "/login"} />}
        />
      </Routes>
    </>
  );
};

export default App;
