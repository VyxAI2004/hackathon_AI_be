"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const base_repository_1 = require("./base.repository");
const enums_1 = require("../../shared/enums");
const typeorm_1 = require("typeorm");
class TaskRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    async findOne(options) {
        const opts = {
            ...options,
            relations: Array.isArray(options.relations)
                ? Array.from(new Set([...options.relations, "assignedUsers"]))
                : ["assignedUsers"],
        };
        return this.repo.findOne(opts);
    }
    async search(filters, skip = 0, limit = 100) {
        const qb = this.repo.createQueryBuilder("task");
        if (filters) {
            if (filters.q) {
                qb.andWhere("(task.title ILIKE :q OR task.description ILIKE :q)", { q: `%${filters.q}%` });
            }
            if (filters.title) {
                qb.andWhere("task.title ILIKE :title", { title: `%${filters.title}%` });
            }
            if (filters.status) {
                qb.andWhere("task.status = :status", { status: filters.status });
            }
            if (filters.priority) {
                qb.andWhere("task.priority = :priority", { priority: filters.priority });
            }
            if (filters.assigneeIds && filters.assigneeIds.length > 0) {
                qb.innerJoin("task.assignedUsers", "assignedUsers")
                    .andWhere("assignedUsers.id IN (:...assigneeIds)", { assigneeIds: filters.assigneeIds });
            }
            if (filters.due_date) {
                qb.andWhere("task.due_date = :due_date", { due_date: filters.due_date });
            }
        }
        qb.skip(skip).take(limit).orderBy("task.created_at", "DESC");
        qb.leftJoinAndSelect("task.assignedUsers", "assignedUsers");
        return qb.getMany();
    }
    async getByAssignee(user_id, skip = 0, limit = 100) {
        return this.repo
            .createQueryBuilder("task")
            .innerJoin("task.assignedUsers", "assignedUsers")
            .leftJoinAndSelect("task.assignedUsers", "assignedUsersSelect")
            .where("assignedUsers.id = :userId", { userId: user_id })
            .skip(skip)
            .take(limit)
            .orderBy("task.created_at", "DESC")
            .getMany();
    }
    async getOverdue(skip = 0, limit = 100) {
        const now = new Date();
        return this.repo.find({
            where: {
                due_date: (0, typeorm_1.LessThan)(now),
                status: (0, typeorm_1.Not)(enums_1.TaskStatus.COMPLETED),
            },
            skip,
            take: limit,
            order: { due_date: "ASC" },
        });
    }
    async getByTaskList(task_list_id, skip = 0, limit = 100) {
        return this.repo.find({
            where: { taskList: { id: task_list_id } },
            skip,
            take: limit,
            order: { created_at: "DESC" },
            relations: ["assignedUsers"],
        });
    }
    async getMyTasks(filters, skip = 0, limit = 20) {
        const qb = this.repo
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.assignedUsers", "assignedUsers")
            .where("assignedUsers.id = :userId OR task.created_by = :userId", { userId: filters.user_id })
            .distinct(true)
            // Sắp xếp theo thời gian gần nhất (created_at hoặc updated_at)
            .orderBy("task.created_at", "DESC")
            .skip(skip)
            .take(limit);
        if (filters.task_list_id) {
            qb.andWhere("task.task_list_id = :taskListId", { taskListId: filters.task_list_id });
        }
        const [tasks, total] = await qb.getManyAndCount();
        return { items: tasks, total };
    }
    async getStatsByStatus() {
        const rows = await this.repo
            .createQueryBuilder("task")
            .select("task.status", "status")
            .addSelect("COUNT(task.id)", "count")
            .groupBy("task.status")
            .getRawMany();
        return rows.reduce((acc, r) => {
            acc[r.status] = parseInt(r.count, 10);
            return acc;
        }, {});
    }
    async getStatsByPriority() {
        const rows = await this.repo
            .createQueryBuilder("task")
            .select("task.priority", "priority")
            .addSelect("COUNT(task.id)", "count")
            .groupBy("task.priority")
            .getRawMany();
        return rows.reduce((acc, r) => {
            acc[r.priority] = parseInt(r.count, 10);
            return acc;
        }, {});
    }
    async countCurrents(filters) {
        const qb = this.repo.createQueryBuilder("task").select("COUNT(task.id)", "count");
        if (filters) {
            if (filters.q) {
                qb.andWhere("(task.title ILIKE :q OR task.description ILIKE :q)", { q: `%${filters.q}%` });
            }
            if (filters.title) {
                qb.andWhere("task.title ILIKE :title", { title: `%${filters.title}%` });
            }
            if (filters.status) {
                qb.andWhere("task.status = :status", { status: filters.status });
            }
            if (filters.priority) {
                qb.andWhere("task.priority = :priority", { priority: filters.priority });
            }
            if (filters.assigneeIds && filters.assigneeIds.length > 0) {
                qb.innerJoin("task.assignedUsers", "assignedUsers")
                    .andWhere("assignedUsers.id IN (:...assigneeIds)", { assigneeIds: filters.assigneeIds });
            }
            if (filters.due_date) {
                qb.andWhere("task.due_date = :due_date", { due_date: filters.due_date });
            }
        }
        const result = await qb.getRawOne();
        return parseInt(result?.count || "0", 10);
    }
}
exports.TaskRepository = TaskRepository;
