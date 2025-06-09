import { Router } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController';

const router = Router();

// Create a new task
router.post('/', createTask);

// Get all tasks
router.get('/', getAllTasks);

// Get task by ID
router.get('/:id', getTaskById);

// Update task
router.put('/:id', updateTask);

// Delete task
router.delete('/:id', deleteTask);

export default router; 