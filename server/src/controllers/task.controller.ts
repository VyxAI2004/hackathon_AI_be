import { NextFunction, Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { AuthRequest } from "../core/auth/auth.middleware";
import { MyTaskFilters } from "../repositories/task.repository";
import { User } from "../entities/user.entity";

export class TaskController {
  constructor(private service: TaskService) {}

  async search(req: Request, res: Response) {
    const tasks = await this.service.search(req.query as any);
    res.json(tasks);
  }

  async getByAssignee(req: Request, res: Response) {
    const tasks = await this.service.getByAssignee(req.params.userId);
    res.json(tasks);
  }

  async getById(req: Request, res: Response) {
    const task = await this.service.getById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  }

  async getOverdue(req: Request, res: Response) {
    const tasks = await this.service.getOverdue();
    res.json(tasks);
  }

  async getByTaskList(req: Request, res: Response) {
    const tasks = await this.service.getByTaskList(req.params.taskListId);
    res.json(tasks);
  }

  async getStatsByStatus(req: Request, res: Response) {
    const stats = await this.service.getStatsByStatus();
    res.json(stats);
  }

  async getStatsByPriority(req: Request, res: Response) {
    const stats = await this.service.getStatsByPriority();
    res.json(stats);
  }

  async countCurrents(req: Request, res: Response) {
    const count = await this.service.countCurrents(req.query as any);
    res.json({ count });
  }

async createTask(req: AuthRequest, res: Response) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, description, status, priority, due_date, assigneeIds } = req.body;
  const user = { id: user_id } as User;

  const payload = {
    title,
    description,
    status,
    priority,
    due_date,
    createdBy: user,
  };

  try {
    const task = await this.service.createTask(payload);
    if (assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
      await this.service.assignTask(task.id, assigneeIds);
    }
    const result = await this.service.getById(task.id);
    return res.status(201).json(result);
  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({ message: "Task creation failed" });
  }
}
  
  async updateTask(req: Request, res: Response) {
    const { assigneeIds, ...updatePayload } = req.body;
    const taskId = req.params.id;
    const task = await this.service.updateTask(taskId, updatePayload);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (assigneeIds && Array.isArray(assigneeIds)) {
      await this.service.assignTask(taskId, assigneeIds);
    }
    const result = await this.service.getById(taskId);
    res.json(result);
  }

  async deleteTask(req: Request, res: Response) {
    const ok = await this.service.deleteTask(req.params.id);
    if (!ok) return res.status(404).json({ message: "Task not found" });
    res.status(200).send();
  }

  async assignTask(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { assigneeIds } = req.body;
      const updatedTask = await this.service.assignTask(taskId, assigneeIds);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found." });
      }
      res.status(200).json(updatedTask);
    } catch (e) {
    }
  }

  async unassignTask(req: Request, res: Response) {
    try {
      const { taskId, userId } = req.params;
      const success = await this.service.unassignTask(taskId, userId);
      if (!success) {
        return res.status(404).json({ message: "Assignment not found." });
      }
      res.status(200).send(); 
    } catch (e) {
    }
  }
  async changeStatus(req: Request, res: Response) {
    const task = await this.service.changeStatus(req.params.id, req.body.status);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  }

  async updatePriority(req: Request, res: Response) {
    const task = await this.service.updatePriority(req.params.id, req.body.priority);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  }

  async getMyTasks(req: AuthRequest, res: Response, next: any) {
    try {
      const user_id = req.user?.id;
      if (!user_id) {
          return res.status(401).json({ message: "Unauthorized: User ID missing" });
      }

      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters: MyTaskFilters = { user_id };

      const { items, total } = await this.service.getMyTasks(
        filters,
        skip,
        limit
      );

      res.json({ items, total });
    } catch (err) {
      next(err);
    }
  }

}
