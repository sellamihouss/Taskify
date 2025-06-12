import { useState } from 'react';
import type { FC } from 'react';
import type { Task } from '../../types/task';
import type { TaskFormData } from '../../validations/schemas';
import { TaskForm } from './TaskForm';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../../services/queries';

interface TaskListProps {
  userId: string;
}

const TaskList: FC<TaskListProps> = ({ userId }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { data: tasks = [], isLoading: isLoadingTasks } = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId);
      setTaskToDelete(null);
    } catch (err) {
      console.log('Failed to delete task');
    }
  };

  const handleCreate = async (formData: TaskFormData) => {
    try {
      const newTask: Omit<Task, 'id' | 'user'> = {
        ...formData,
        userId,
        dueDate: new Date(formData.dueDate),
        description: formData.description || ''
      };
      await createTask.mutateAsync(newTask);
      setIsModalOpen(false);
      setIsCreating(false);
      setEditingTask(null);
    } catch (err) {
      console.log('Failed to create task');
    }
  };

  const handleUpdate = async (formData: TaskFormData) => {
    if (!editingTask) return;
    try {
      const updatedTask: Task = {
        ...formData,
        id: editingTask.id,
        userId,
        user: editingTask.user,
        dueDate: new Date(formData.dueDate),
        description: formData.description || ''
      };
      await updateTask.mutateAsync({ id: updatedTask.id, task: updatedTask });
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
    .filter(task => task.userId === userId)
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

  if (isLoadingTasks) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50 w-full flex items-center justify-center">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

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
                      onClick={() => {
                        setTaskToDelete(task);
                      }}
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

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the task "{taskToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(taskToDelete.id)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                disabled={deleteTask.isPending}
              >
                {deleteTask.isPending ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setTaskToDelete(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">{isCreating ? 'Create New Task' : 'Edit Task'}</h3>
            <TaskForm
              onSubmit={(data) => {
                if (isCreating) {
                  handleCreate(data);
                } else {
                  handleUpdate(data);
                }
              }}
              isLoading={createTask.isPending || updateTask.isPending}
              initialData={{
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
                priority: editingTask.priority,
                dueDate: new Date(editingTask.dueDate).toISOString().split('T')[0]
              }}
            />
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
              className="mt-4 w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 