"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogController = void 0;
class ActivityLogController {
    constructor(service) {
        this.service = service;
    }
    // Search logs with filters, pagination, and return total
    async search(req, res) {
        const { page = 1, limit = 10, ...filters } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const logs = await this.service.search(filters, skip, Number(limit));
        const total = await this.service.countCurrents(filters);
        res.status(200).json({ items: logs, total });
    }
    // Get logs by action
    async getByAction(req, res) {
        const { action } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const logs = await this.service.getByAction(action, skip, Number(limit));
        const total = await this.service.countCurrents({ action });
        res.status(200).json({ items: logs, total });
    }
    async getByUser(userId, skip, take) {
        return this.service.getByUser(userId, skip, take);
    }
    // Get logs by target
    async getByTarget(req, res) {
        const { targetId, targetType } = req.params;
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const logs = await this.service.getByTarget(targetId, targetType, skip, Number(limit));
        const filters = { target_id: targetId };
        if (targetType)
            filters.target_type = targetType;
        const total = await this.service.countCurrents(filters);
        res.status(200).json({ items: logs, total });
    }
}
exports.ActivityLogController = ActivityLogController;
