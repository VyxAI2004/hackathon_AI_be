import { Request, Response } from "express";
import { ActivityLogService } from "../services/activity-log.service";
import { AuthRequest } from "../core/auth/auth.middleware";

export class ActivityLogController {
  constructor(private service: ActivityLogService) {}
  


  // Search logs with filters, pagination, and return total
  async search(req: Request, res: Response) {
    const { page = 1, limit = 10, ...filters } = req.query as any;
    const skip = (Number(page) - 1) * Number(limit);
    const logs = await this.service.search(filters, skip, Number(limit));
    const total = await this.service.countCurrents(filters);
    res.status(200).json({ items: logs, total });
  }

  // Get logs by action
  async getByAction(req: Request, res: Response) {
    const { action } = req.params;
    const { page = 1, limit = 10 } = req.query as any;
    const skip = (Number(page) - 1) * Number(limit);
    const logs = await this.service.getByAction(action, skip, Number(limit));
    const total = await this.service.countCurrents({ action });
    res.status(200).json({ items: logs, total });
  }

  async getByUser(userId: string, skip: number, take: number) {
    return this.service.getByUser(userId, skip, take);
  }
  // Get logs by target
  async getByTarget(req: Request, res: Response) {
    const { targetId, targetType } = req.params;
    const { page = 1, limit = 10 } = req.query as any;
    const skip = (Number(page) - 1) * Number(limit);
    const logs = await this.service.getByTarget(targetId, targetType, skip, Number(limit));
    const filters: any = { target_id: targetId };
    if (targetType) filters.target_type = targetType;
    const total = await this.service.countCurrents(filters);
    res.status(200).json({ items: logs, total });
  }
}




