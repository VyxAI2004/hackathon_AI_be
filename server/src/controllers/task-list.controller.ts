import { Request, Response } from "express";
import { TaskListService } from "../services/task-list.service";
import { AuthRequest } from "../core/auth/auth.middleware";

export class TaskListController {
  constructor(private service: TaskListService) {}

  async createTaskList(req: AuthRequest, res: Response) {
    const { name, description } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const taskList = await this.service.createTaskList({
      name,
      description,
      createdBy: { id: userId }
    });
    res.status(201).json(taskList);
  }

  async updateTaskList(req: Request, res: Response) {
    const taskList = await this.service.updateTaskList(req.params.id, req.body);
    if (!taskList) return res.status(404).json({ message: "TaskList not found" });
    res.json(taskList);
  }

  async deleteTaskList(req: Request, res: Response) {
    const ok = await this.service.deleteTaskList(req.params.id);
    if (!ok) return res.status(404).json({ message: "TaskList not found" });
    res.status(204).send();
  }

  async getByCreator(req: Request, res: Response) {
    const lists = await this.service.getByCreator(req.params.userId);
    res.json(lists);
  }

  async getSharedWithUser(req: Request, res: Response) {
    const lists = await this.service.getSharedWithUser(req.params.userId);
    res.json(lists);
  }

  async getAllForUser(req: Request, res: Response) {
    const lists = await this.service.getAllForUser(req.params.userId);
    res.json(lists);
  }

  async addUser(req: Request, res: Response) {
    const userTaskList = await this.service.addUser(req.params.id, req.body.userId, req.body.permission);
    res.status(201).json(userTaskList);
  }

  async removeUser(req: Request, res: Response) {
    const ok = await this.service.removeUser(req.params.id, req.body.userId);
    if (!ok) return res.status(404).json({ message: "User not found in TaskList" });
    res.status(204).send();
  }

  async getTasksInList(req: Request, res: Response) {
    const tasks = await this.service.getTasksInList(req.params.id);
    res.json(tasks);
  }

  async search(req: Request, res: Response) {
    const lists = await this.service.search(req.query.q as string);
    res.json(lists);
  }

  async countCurrents(req: Request, res: Response) {
    const count = await this.service.countCurrents(req.query.q as string);
    res.json({ count });
  }
}
