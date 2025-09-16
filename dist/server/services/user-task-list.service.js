"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTaskListService = void 0;
const user_task_list_entity_1 = require("../entities/user-task-list.entity");
const base_service_1 = require("./base.service");
const enums_1 = require("../../shared/enums");
class UserTaskListService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    async checkPermission(userId, taskListId, required) {
        const perm = await this.getPermission(userId, taskListId);
        if (!perm) {
            return false;
        }
        const priority = {
            [enums_1.Permission.VIEW]: 1,
            [enums_1.Permission.EDIT]: 2,
            [enums_1.Permission.ADMIN]: 3,
        };
        return priority[perm] >= priority[required];
    }
    async getUserTaskLists(userId) {
        return this.repo.getByUser(userId);
    }
    async getTaskListUsers(taskListId) {
        return this.repo.getByTaskList(taskListId);
    }
    async getPermission(userId, taskListId) {
        const perm = await this.repo.getPermission(userId, taskListId);
        return perm;
    }
    async shareTaskList(payload) {
        const existingRecord = await this.repo.getPermission(payload.user?.id || "", payload.taskList?.id || "");
        if (existingRecord) {
            const userTaskListRepo = this.repo.manager.getRepository(user_task_list_entity_1.UserTaskList);
            const existingUserTaskList = await userTaskListRepo.findOne({
                where: {
                    user: { id: payload.user?.id },
                    taskList: { id: payload.taskList?.id },
                },
            });
            if (existingUserTaskList) {
                existingUserTaskList.permission = payload.permission;
                return userTaskListRepo.save(existingUserTaskList);
            }
        }
        return this.create(payload);
    }
    async revokeAccess(userId, taskListId) {
        const userTaskListRepo = this.repo.manager.getRepository(user_task_list_entity_1.UserTaskList);
        const result = await userTaskListRepo.delete({
            user: { id: userId },
            taskList: { id: taskListId },
        });
        return !!result.affected && result.affected > 0;
    }
    async updatePermission(userId, taskListId, newPermission) {
        const userTaskListRepo = this.repo.manager.getRepository(user_task_list_entity_1.UserTaskList);
        const record = await userTaskListRepo.findOne({
            where: {
                user: { id: userId },
                taskList: { id: taskListId },
            },
        });
        if (!record) {
            return null;
        }
        record.permission = newPermission;
        return userTaskListRepo.save(record);
    }
}
exports.UserTaskListService = UserTaskListService;
