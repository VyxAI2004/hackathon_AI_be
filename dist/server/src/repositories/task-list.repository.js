"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListRepository = void 0;
const typeorm_1 = require("typeorm");
const base_repository_1 = require("./base.repository");
const user_task_list_entity_1 = require("../entities/user-task-list.entity");
const task_entity_1 = require("../entities/task.entity");
class TaskListRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    async getByCreator(userId, skip = 0, limit = 100) {
        return this.repo.find({
            where: { createdBy: { id: userId } },
            skip,
            take: limit,
        });
    }
    async getSharedWithUser(userId, skip = 0, limit = 100) {
        const userTaskListRepo = this.repo.manager.getRepository(user_task_list_entity_1.UserTaskList);
        const sharedTaskLists = await userTaskListRepo.find({
            where: { user: { id: userId } },
            select: ["taskList"],
        });
        const taskListIds = sharedTaskLists.map((utl) => utl.taskList.id);
        if (taskListIds.length === 0) {
            return [];
        }
        return this.repo.find({
            where: { id: (0, typeorm_1.In)(taskListIds) },
            skip,
            take: limit,
        });
    }
    async getTasksInList(taskListId, skip = 0, limit = 100) {
        // Nếu muốn lấy tasks của một taskList, nên dùng repo của Task để truy vấn theo quan hệ
        const taskRepo = this.repo.manager.getRepository(task_entity_1.Task);
        return await taskRepo.find({
            where: { taskList: { id: taskListId } },
            skip,
            take: limit,
            order: { created_at: "DESC" },
        });
    }
    async search(filters, skip = 0, limit = 100) {
        const qb = this.repo.createQueryBuilder("task_list");
        if (filters) {
            if (filters.q) {
                qb.andWhere("(task_list.name ILIKE :q OR task_list.description ILIKE :q)", { q: `%${filters.q}%` });
            }
            if (filters.name) {
                qb.andWhere("task_list.name ILIKE :name", { name: `%${filters.name}%` });
            }
        }
        qb.skip(skip).take(limit).orderBy("task_list.created_at", "DESC");
        return qb.getMany();
    }
    async countCurrents(filters) {
        const qb = this.repo.createQueryBuilder("task_list");
        if (filters) {
            if (filters.q) {
                qb.andWhere("(task_list.name ILIKE :q OR task_list.description ILIKE :q)", { q: `%${filters.q}%` });
            }
            if (filters.name) {
                qb.andWhere("task_list.name ILIKE :name", { name: `%${filters.name}%` });
            }
        }
        return qb.getCount();
    }
}
exports.TaskListRepository = TaskListRepository;
