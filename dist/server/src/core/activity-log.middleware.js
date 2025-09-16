"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLogMiddleware = void 0;
const activity_log_service_1 = require("../services/activity-log.service");
const db_1 = require("../core/db");
const activity_log_repository_1 = require("../repositories/activity-log.repository");
const activity_log_entity_1 = require("../entities/activity-log.entity");
const activityLogService = new activity_log_service_1.ActivityLogService(new activity_log_repository_1.ActivityLogRepository(db_1.AppDataSource.getRepository(activity_log_entity_1.ActivityLog)));
const activityLogMiddleware = (action, targetType) => {
    return async (req, res, next) => {
        res.on("finish", () => {
            // chạy async nhưng không chờ kết quả
            (async () => {
                try {
                    const user = req.user;
                    const target_id = req.params.id || req.body.id;
                    let oldData = {};
                    let newData = {};
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
                    }
                    else {
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
                }
                catch (err) {
                    console.error("Activity log error:", err);
                }
            })();
        });
        next(); // cho response đi luôn, không bị block
    };
};
exports.activityLogMiddleware = activityLogMiddleware;
