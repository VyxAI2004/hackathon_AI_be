import { Router } from "express";
import { DataSource } from "typeorm";
import { ActivityLog } from "../entities/activity-log.entity";
import { ActivityLogRepository } from "../repositories/activity-log.repository";
import { ActivityLogService } from "../services/activity-log.service";
import { ActivityLogController } from "../controllers/activity-log.controller";
import { authMiddleware } from "../core/auth/auth.middleware";

export default function activityLogRouterFactory(dataSource: DataSource) {
  const logRepo = new ActivityLogRepository(dataSource.getRepository(ActivityLog));
  const logService = new ActivityLogService(logRepo);
  const logController = new ActivityLogController(logService);
  const router = Router();

  // Middleware auth chung cho tất cả route
  router.use(authMiddleware);

  router.get("/", async (req, res, next) => {
    try {
      const user_id = req.query.user_id as string; 
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!user_id) {
        return res.status(400).json({ message: "user_id là bắt buộc" });
      }

      const logs = await logController.getByUser(user_id, skip, limit);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
