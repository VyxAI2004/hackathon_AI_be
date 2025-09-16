"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const base_service_1 = require("./base.service");
const db_1 = require("../core/db");
const entity_registry_1 = require("../core/entity-registry");
class ActivityLogService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    // Tạo log chi tiết
    async createLog({ user, action, target_id, target_type, created_at, log_metadata, }) {
        const payload = {
            user,
            action,
            target_id,
            target_type,
            created_at,
            log_metadata,
        };
        return this.create(payload);
    }
    // Tìm kiếm log với filter linh hoạt
    async search(filters, skip = 0, limit = 100) {
        return this.repo.search(filters, skip, limit);
    }
    // Đếm số log theo filters
    async countCurrents(filters) {
        return this.repo.countCurrents(filters);
    }
    // Inside ActivityLogService
    async getByUser(userId, skip, take) {
        return this.repo.findByUser(userId, skip, take);
    }
    // Lấy log theo action
    async getByAction(action, skip = 0, limit = 100) {
        return this.repo.search({ action }, skip, limit);
    }
    // Lấy log theo target
    async getByTarget(targetId, targetType, skip = 0, limit = 100) {
        const filters = { target_id: targetId };
        if (targetType) {
            filters.target_type = targetType;
        }
        return this.repo.search(filters, skip, limit);
    }
    async getTargetBeforeUpdate(targetId, targetType) {
        if (!targetId || !targetType)
            return null;
        const Entity = entity_registry_1.EntityRegistry[targetType];
        if (!Entity)
            return null; // nếu chưa được map
        const repo = db_1.AppDataSource.getRepository(Entity);
        const record = await repo.findOne({
            where: { id: targetId },
        });
        return record || null;
    }
}
exports.ActivityLogService = ActivityLogService;
