"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogRepository = void 0;
const base_repository_1 = require("./base.repository");
class ActivityLogRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    applyFilters(qb, filters) {
        if (!filters)
            return qb;
        if (filters.q) {
            qb.andWhere("(log.action ILIKE :q OR log.target_type ILIKE :q)", {
                q: `%${filters.q}%`,
            });
        }
        if (filters.action)
            qb.andWhere("log.action = :action", { action: filters.action });
        if (filters.user_id)
            qb.andWhere("log.user_id = :user_id", { user_id: filters.user_id });
        if (filters.target_id)
            qb.andWhere("log.target_id = :target_id", { target_id: filters.target_id });
        if (filters.target_type)
            qb.andWhere("log.target_type = :target_type", { target_type: filters.target_type });
        return qb;
    }
    async search(filters, skip = 0, limit = 100) {
        const qb = this.repo.createQueryBuilder("log")
            .orderBy("log.created_at", "DESC")
            .skip(skip)
            .take(limit);
        this.applyFilters(qb, filters);
        return qb.getMany();
    }
    async countCurrents(filters) {
        const qb = this.repo.createQueryBuilder("log")
            .select("COUNT(log.id)", "count");
        this.applyFilters(qb, filters);
        const result = await qb.getRawOne();
        return parseInt(result?.count || "0", 10);
    }
    async findByUser(userId, skip, take) {
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
exports.ActivityLogRepository = ActivityLogRepository;
