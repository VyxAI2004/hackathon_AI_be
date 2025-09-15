// services/activity-log.service.ts
import { ActivityLog } from "../entities/activity-log.entity";
import { ActivityLogRepository, ActivityLogFilters } from "../repositories/activity-log.repository";
import { BaseService } from "./base.service";
import { DeepPartial } from "typeorm";
import { AppDataSource } from "../core/db";
import { EntityRegistry } from "../core/entity-registry";

export class ActivityLogService extends BaseService<ActivityLog> {
  protected repo: ActivityLogRepository;

  constructor(repo: ActivityLogRepository) {
    super(repo);
    this.repo = repo;
  }

  // Tạo log chi tiết
  async createLog({
    user,
    action,
    target_id,
    target_type,
    created_at,
    log_metadata,
  }: {
    user: any; // Nên là User entity, hoặc ít nhất có id
    action: string;
    target_id?: string;
    target_type?: string;
    created_at?: Date;
    log_metadata?: Record<string, any>;
  }): Promise<ActivityLog> {
    const payload: DeepPartial<ActivityLog> = {
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
  async search(
    filters?: ActivityLogFilters,
    skip = 0,
    limit = 100
  ): Promise<ActivityLog[]> {
    return this.repo.search(filters, skip, limit);
  }

  // Đếm số log theo filters
  async countCurrents(filters?: ActivityLogFilters): Promise<number> {
    return this.repo.countCurrents(filters);
  }

// Inside ActivityLogService
async getByUser(userId: string, skip: number, take: number) {
  return this.repo.findByUser(userId, skip, take);
}

// Lấy log theo action
async getByAction(action: string, skip = 0, limit = 100): Promise<ActivityLog[]> {
  return this.repo.search({ action }, skip, limit);
}

  // Lấy log theo target
  async getByTarget(
    targetId: string,
    targetType?: string,
    skip = 0,
    limit = 100
  ): Promise<ActivityLog[]> {
    const filters: ActivityLogFilters = { target_id: targetId };
    if (targetType) {
      filters.target_type = targetType;
    }
    return this.repo.search(filters, skip, limit);
  }
    async getTargetBeforeUpdate(targetId: string, targetType?: string): Promise<any | null> {
    if (!targetId || !targetType) return null;

    const Entity = EntityRegistry[targetType];
    if (!Entity) return null; // nếu chưa được map

    const repo = AppDataSource.getRepository(Entity);
    const record = await repo.findOne({
      where: { id: targetId },
    });

    return record || null;
  }
}
