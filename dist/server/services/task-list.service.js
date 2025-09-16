"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListService = void 0;
const base_service_1 = require("./base.service");
const user_task_list_entity_1 = require("../entities/user-task-list.entity");
const enums_1 = require("../../shared/enums");
class TaskListService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    // Basic CRUD operations on TaskList
    async createTaskList(payload) {
        return this.create(payload);
    }
    async updateTaskList(taskListId, payload) {
        const dbTaskList = await this.get(taskListId);
        if (!dbTaskList) {
            return null;
        }
        return this.update(taskListId, payload);
    }
    async deleteTaskList(taskListId) {
        return this.delete(taskListId);
    }
    // Get task lists based on user
    async getByCreator(userId, skip = 0, limit = 100) {
        return this.repo.getByCreator(userId, skip, limit);
    }
    async getSharedWithUser(userId, skip = 0, limit = 100) {
        return this.repo.getSharedWithUser(userId, skip, limit);
    }
    async getAllForUser(userId, skip = 0, limit = 100) {
        const created = await this.getByCreator(userId);
        const shared = await this.getSharedWithUser(userId);
        const allLists = new Map();
        created.forEach((tl) => allLists.set(tl.id, tl));
        shared.forEach((tl) => allLists.set(tl.id, tl));
        const sortedLists = Array.from(allLists.values());
        return sortedLists.slice(skip, skip + limit);
    }
    // User management for a task list
    async addUser(taskListId, userId, permission = enums_1.Permission.VIEW) {
        const userTaskListRepo = this.repo.manager.getRepository(user_task_list_entity_1.UserTaskList);
        const userTask = userTaskListRepo.create({
            taskList: { id: taskListId },
            user: { id: userId },
            permission,
        });
        return userTaskListRepo.save(userTask);
    }
    async removeUser(taskListId, userId) {
        const userTaskListRepo = this.repo.manager.getRepository(user_task_list_entity_1.UserTaskList);
        const result = await userTaskListRepo.delete({
            taskList: { id: taskListId },
            user: { id: userId },
        });
        return !!result.affected && result.affected > 0;
    }
    // Get tasks within a list
    async getTasksInList(taskListId, skip = 0, limit = 100) {
        return this.repo.getTasksInList(taskListId, skip, limit);
    }
    // Search functionality
    async search(query, skip = 0, limit = 100) {
        return this.repo.search(query ? { q: query } : undefined, skip, limit);
    }
    async countCurrents(query) {
        return this.repo.countCurrents(query ? { q: query } : undefined);
    }
}
exports.TaskListService = TaskListService;
