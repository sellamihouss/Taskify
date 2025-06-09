import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login.tsx';
import Register from './components/auth/Register.tsx';
import TaskList from './components/tasks/TaskList.tsx';

const App: FC = () => {
  return (
    <Router>
      { <nav>
          <div>
            <div>
              <div>
                <h1>Task Manager</h1>
              </div>
              <div className="text-right">
                <span>Welcome, houssem</span>
                <button 
                  
                  className="ml-2 px-2 py-1 bg-red-500 text-white"
                >
                  logout
                </button>
              </div>
            </div>
          </div>
        </nav>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TaskList />} />
      </Routes>
    </Router>
  );
};

export default App;
