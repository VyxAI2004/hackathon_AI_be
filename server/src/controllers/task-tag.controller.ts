import { Request, Response } from 'express';
import { TaskTagService } from '../services/task-tag.service';

export class TaskTagController {
  constructor(private service: TaskTagService) {}

  async createTaskTag(req: Request, res: Response) {
    const taskTag = await this.service.createTaskTag(req.body);
    res.status(201).json(taskTag);
  }

  async deleteTaskTag(req: Request, res: Response) {
    const ok = await this.service.deleteTaskTag(req.params.id);
    if (!ok) return res.status(404).json({ message: 'TaskTag not found' });
    res.status(204).send();
  }

  async getTagsOfTask(req: Request, res: Response) {
    const tags = await this.service.getTagsOfTask(req.params.taskId);
    res.json(tags);
  }

  async getTasksOfTag(req: Request, res: Response) {
    const tasks = await this.service.getTasksOfTag(req.params.tagId);
    res.json(tasks);
  }
}
