import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { Task } from '../../types/task';
import { taskService } from '../../services/api';

interface TaskListProps {
  userId: string;
}

const TaskList: FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        const userTasks = data.filter(task => task.userId === userId);
        setTasks(userTasks);
      } catch (err) {
        console.log('Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, [userId]);

  const handleDelete = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.log('Failed to delete task');
    }
  };

  const handleCreate = async (newTask: Omit<Task, 'id' | 'user'>) => {
    try {
      const result = await taskService.createTask(newTask);
      setTasks([result,...tasks ]);
      setIsModalOpen(false);
      setIsCreating(false);
      setEditingTask(null);
    } catch (err) {
      console.log('Failed to create task');
    }
  };

  const handleUpdate = async (updatedTask: Task) => {
    try {
      const result = await taskService.updateTask(updatedTask.id, updatedTask);
      setTasks(tasks.map(task => task.id === result.id ? result : task));
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.log('Failed to update task');
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsCreating(false);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: new Date(),
      userId: userId,
      user: { id: userId, email: '' }
    });
    setIsCreating(true);
    setIsModalOpen(true);
  };

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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-medium text-gray-900">Your Tasks</h2>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Task
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <select 
            className="px-3 py-2 border rounded-md"
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select 
            className="px-3 py-2 border rounded-md"
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            className="px-3 py-2 border rounded-md"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
        
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 w-full">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
            {filteredAndSortedTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-4 flex-grow">{task.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Priority:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Due:</span>
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(task)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">{isCreating ? 'Create New Task' : 'Edit Task'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (isCreating) {
                handleCreate(editingTask);
              } else {
                handleUpdate(editingTask);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({...editingTask, status: e.target.value as 'pending' | 'in-progress' | 'completed'})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    value={new Date(editingTask.dueDate).toISOString().split('T')[0]}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: new Date(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTask(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isCreating ? 'Create Task' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 