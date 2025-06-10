import { Response, Request } from 'express';
import { PrismaClient } from '../generated/prisma';
import { CreateTaskRequest, UpdateTaskRequest, TaskIdRequest } from '../interfaces/task.interface';

const prisma = new PrismaClient();

// Create a new task
export const createTask = async (req: CreateTaskRequest, res: Response) => {
  try {
    const { title, description, status, dueDate, priority, userId } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate: new Date(dueDate), //date input from the user check the format 
        priority,
        userId
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// Get all tasks
export const getAllTasks = async (req: CreateTaskRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        user: true
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get task by ID
export const getTaskById = async (req: TaskIdRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        user: true
      }
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json(task);
  } catch (error) {
   return res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Update task
export const updateTask = async (req: UpdateTaskRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate, priority } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority
      }
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
};

// Delete task
export const deleteTask = async (req: TaskIdRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
}; 