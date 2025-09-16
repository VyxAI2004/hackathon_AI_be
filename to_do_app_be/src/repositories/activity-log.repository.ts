import { Repository, ILike } from "typeorm";
import { BaseRepository } from "./base.repository";
import { ActivityLog } from "../entities/activity-log.entity";

export type ActivityLogFilters = {
  q?: string;
  action?: string;
  user_id?: string;
  target_id?: string;
  target_type?: string;
};

export class ActivityLogRepository extends BaseRepository<ActivityLog> {
  constructor(repo: Repository<ActivityLog>) {
    super(repo);
  }

  private applyFilters(qb: any, filters?: ActivityLogFilters) {
    if (!filters) return qb;

    if (filters.q) {
      qb.andWhere("(log.action ILIKE :q OR log.target_type ILIKE :q)", {
        q: `%${filters.q}%`,
      });
    }
    if (filters.action) qb.andWhere("log.action = :action", { action: filters.action });
    if (filters.user_id) qb.andWhere("log.user_id = :user_id", { user_id: filters.user_id });
    if (filters.target_id) qb.andWhere("log.target_id = :target_id", { target_id: filters.target_id });
    if (filters.target_type) qb.andWhere("log.target_type = :target_type", { target_type: filters.target_type });

    return qb;
  }

  async search(filters?: ActivityLogFilters, skip = 0, limit = 100): Promise<ActivityLog[]> {
    const qb = this.repo.createQueryBuilder("log")
      .orderBy("log.created_at", "DESC")
      .skip(skip)
      .take(limit);

    this.applyFilters(qb, filters);
    return qb.getMany();
  }

  async countCurrents(filters?: ActivityLogFilters): Promise<number> {
    const qb = this.repo.createQueryBuilder("log")
      .select("COUNT(log.id)", "count");

    this.applyFilters(qb, filters);
    const result = await qb.getRawOne<{ count: string }>();
    return parseInt(result?.count || "0", 10);
  }

  async findByUser(userId: string, skip: number, take: number) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: {
      created_at: 'DESC', // Hoặc 'updatedAt'
      },
      skip: skip,
      take: take,
    });
  }
}
