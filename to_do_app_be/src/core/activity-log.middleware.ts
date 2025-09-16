import { Response, NextFunction } from "express";
import { AuthRequest } from "../core/auth/auth.middleware"; 
import { ActivityLogService } from "../services/activity-log.service";
import { AppDataSource } from "../core/db";
import { ActivityLogRepository } from "../repositories/activity-log.repository";
import { ActivityLog } from "../entities/activity-log.entity";

const activityLogService = new ActivityLogService(
  new ActivityLogRepository(AppDataSource.getRepository(ActivityLog))
);

export const activityLogMiddleware = (action: string, targetType?: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
res.on("finish", () => {
  // chạy async nhưng không chờ kết quả
  (async () => {
    try {
      const user = req.user;
      const target_id = req.params.id || req.body.id;


      let oldData: any = {};
      let newData: any = {};

      if (action.startsWith("UPDATE") && target_id) {
        oldData = await activityLogService.getTargetBeforeUpdate(target_id, targetType);
        // Remove assignedTo if present in oldData or newData, since it no longer exists
        if (oldData && typeof oldData === 'object') {
          delete oldData.assignedTo;
        }
        newData = { ...oldData, ...req.body };
        if (newData && typeof newData === 'object') {
          delete newData.assignedTo;
        }
      } else {
        newData = { ...req.body };
        if (newData && typeof newData === 'object') {
          delete newData.assignedTo;
        }
      }

      const log_metadata = {
        old: oldData,
        new: newData,
        params: req.params,
      };

      await activityLogService.createLog({
        user,
        action,
        target_id,
        target_type: targetType,
        log_metadata,
      });
    } catch (err) {
      console.error("Activity log error:", err);
    }
  })();
});

next(); // cho response đi luôn, không bị block


  };
};