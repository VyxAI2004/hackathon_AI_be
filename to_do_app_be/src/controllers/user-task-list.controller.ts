import { Request, Response } from "express";
import { UserTaskListService } from "../services/user-task-list.service";

export class UserTaskListController {
  constructor(private service: UserTaskListService) {}

  async getUserTaskLists(req: Request, res: Response) {
    const lists = await this.service.getUserTaskLists(req.params.userId);
    res.json(lists);
  }

  async getTaskListUsers(req: Request, res: Response) {
    const users = await this.service.getTaskListUsers(req.params.taskListId);
    res.json(users);
  }

  async getPermission(req: Request, res: Response) {
    const perm = await this.service.getPermission(req.params.userId, req.params.taskListId);
    res.json({ permission: perm });
  }

  async shareTaskList(req: Request, res: Response) {
    const result = await this.service.shareTaskList(req.body);
    res.status(201).json(result);
  }

  async revokeAccess(req: Request, res: Response) {
    const ok = await this.service.revokeAccess(req.body.userId, req.body.taskListId);
    if (!ok) return res.status(404).json({ message: "UserTaskList not found" });
    res.status(204).send();
  }

  async updatePermission(req: Request, res: Response) {
    const result = await this.service.updatePermission(req.body.userId, req.body.taskListId, req.body.permission);
    if (!result) return res.status(404).json({ message: "UserTaskList not found" });
    res.json(result);
  }

  async checkPermission(req: Request, res: Response) {
    const ok = await this.service.checkPermission(req.body.userId, req.body.taskListId, req.body.required);
    res.json({ allowed: ok });
  }
}
