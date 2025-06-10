import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { Task } from '../../types/task';
import { taskService } from '../../services/api';

interface TaskListProps {
  userId: string;
}

const TaskList: FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        const userTasks = data.filter(task => task.userId === userId);
        setTasks(userTasks);
      } catch (err) {
        console.log('Failed to fetch tasks');
        // setError('Failed to fetch tasks');
      }
      //  finally {
      //   setLoading(false);
      // }
    };

    fetchTasks();
  }, [userId]);


  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => statusFilter === 'all' || task.status === statusFilter)
    .filter(task => priorityFilter === 'all' || task.priority === priorityFilter)
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      }
      if (sortBy === 'status') {
        const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      }
      return 0;
    });


  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
  //       <div className="text-gray-500">Loading tasks...</div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
  //       <div className="text-red-500">{error}</div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-gray-900">Your Tasks</h2>
          {/* <p className="mt-1 text-sm text-gray-600">Manage and track your tasks</p> */}
        </div>

        <div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>

        <br />
        
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 w-full">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
            {filteredAndSortedTasks.map((task) => (
              <div key={task.id} className="border p-4">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div>
                    <span>Priority: {task.priority}</span>
                    <br />
                    <span>Status: {task.status}</span>
                    <br />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 