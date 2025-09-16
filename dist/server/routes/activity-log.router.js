"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = activityLogRouterFactory;
const express_1 = require("express");
const activity_log_entity_1 = require("../entities/activity-log.entity");
const activity_log_repository_1 = require("../repositories/activity-log.repository");
const activity_log_service_1 = require("../services/activity-log.service");
const activity_log_controller_1 = require("../controllers/activity-log.controller");
const auth_middleware_1 = require("../core/auth/auth.middleware");
function activityLogRouterFactory(dataSource) {
    const logRepo = new activity_log_repository_1.ActivityLogRepository(dataSource.getRepository(activity_log_entity_1.ActivityLog));
    const logService = new activity_log_service_1.ActivityLogService(logRepo);
    const logController = new activity_log_controller_1.ActivityLogController(logService);
    const router = (0, express_1.Router)();
    // Middleware auth chung cho tất cả route
    router.use(auth_middleware_1.authMiddleware);
    router.get("/", async (req, res, next) => {
        try {
            const user_id = req.query.user_id;
            const skip = parseInt(req.query.skip) || 0;
            const limit = parseInt(req.query.limit) || 20;
            if (!user_id) {
                return res.status(400).json({ message: "user_id là bắt buộc" });
            }
            const logs = await logController.getByUser(user_id, skip, limit);
            res.json(logs);
        }
        catch (err) {
            next(err);
        }
    });
    return router;
}
