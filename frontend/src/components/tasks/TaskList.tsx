import type { FC } from 'react';
import type { Task } from '../../types/task';

interface TaskListProps {
  userId: string;
}

const TaskList: FC<TaskListProps> = ({ userId }) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-gray-900">Your Tasks</h2>
        </div>

        <div>
          <select>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <br />
        
        <div className="text-center py-12 w-full">
          <p className="text-gray-500">No tasks found. Create your first task!</p>
        </div>
      </div>
    </div>
  );
};

export default TaskList;