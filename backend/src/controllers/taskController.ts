import { Response, Request } from 'express';
import { CreateTaskRequest, UpdateTaskRequest, TaskIdRequest } from '../interfaces/task.interface';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new task
export const createTask = async (req: CreateTaskRequest, res: Response) => {
  // zod to validate task creation
  const validationResult = createTaskSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: validationResult.error.errors
    });
    return
  }

  const { title, description, status, dueDate, priority, userId } = validationResult.data;

  try {
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
    console.log(error)
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
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Update task
export const updateTask = async (req: UpdateTaskRequest, res: Response) => {
  try {
    const { id } = req.params;

    const validationResult = updateTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
     res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors
      });
      return
    }

    const { title, description, status, dueDate, priority } = validationResult.data;
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