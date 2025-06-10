import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskList from './components/tasks/TaskList';
import { authService } from './services/api';
import type { User } from './types/auth';

const App: FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const profile = await authService.getProfile();
        setUser(profile);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>

      {/* {navbar} */}
      
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
    </Router>
  );
};

export default App;
