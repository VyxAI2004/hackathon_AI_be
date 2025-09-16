"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const base_service_1 = require("./base.service");
const enums_1 = require("../../shared/enums");
class TaskService extends base_service_1.BaseService {
    constructor(repo, taskAssignedUserRepository, userRepository) {
        super(repo);
        this.repo = repo;
        this.taskAssignedUserRepository = taskAssignedUserRepository;
        this.userRepository = userRepository;
    }
    // Chức năng tìm kiếm và thống kê
    async search(filters, skip = 0, limit = 100) {
        return this.repo.search(filters, skip, limit);
    }
    async getByAssignee(userId, skip = 0, limit = 100) {
        return this.repo.getByAssignee(userId, skip, limit);
    }
    async getOverdue(skip = 0, limit = 100) {
        return this.repo.getOverdue(skip, limit);
    }
    async getMyTasks(filters, skip, limit) {
        return this.repo.getMyTasks(filters, skip, limit);
    }
    async getByTaskList(taskListId, skip = 0, limit = 100) {
        return this.repo.getByTaskList(taskListId, skip, limit);
    }
    async getStatsByStatus() {
        return this.repo.getStatsByStatus();
    }
    async getById(taskId) {
        return this.repo.findOne({ where: { id: taskId } });
    }
    async getStatsByPriority() {
        return this.repo.getStatsByPriority();
    }
    async countCurrents(filters) {
        return this.repo.countCurrents(filters);
    }
    // Chức năng CRUD và cập nhật trạng thái
    async createTask(payload) {
        return this.repo.create(payload);
    }
    async updateTask(taskId, payload) {
        return this.update(taskId, payload);
    }
    async assignTask(taskId, assigneeIds) {
        const task = await this.get(taskId);
        if (!task) {
            return null;
        }
        if (task.assignedTaskUsers && task.assignedTaskUsers.length > 0) {
            for (const assignment of task.assignedTaskUsers) {
                await this.taskAssignedUserRepository.remove(assignment);
            }
        }
        for (const assigneeId of assigneeIds) {
            const userToAssign = await this.userRepository.get(assigneeId);
            if (userToAssign) {
                await this.taskAssignedUserRepository.create({
                    task_id: taskId,
                    user_id: userToAssign.id,
                });
            }
        }
        return this.repo.findOne({ where: { id: taskId }, relations: ["assignedUsers"] });
    }
    async unassignTask(taskId, userId) {
        const assignment = await this.taskAssignedUserRepository.findOne({
            task_id: taskId,
            user_id: userId,
        });
        if (assignment) {
            await this.taskAssignedUserRepository.remove(assignment);
            return true;
        }
        return false;
    }
    async deleteTask(taskId) {
        return this.delete(taskId);
    }
    async changeStatus(taskId, newStatus) {
        const task = await this.get(taskId);
        if (!task) {
            return null;
        }
        const updateData = { status: newStatus };
        return this.update(taskId, updateData);
    }
    async updatePriority(taskId, newPriority) {
        const task = await this.get(taskId);
        if (!task) {
            return null;
        }
        const updateData = { priority: newPriority };
        return this.update(taskId, updateData);
    }
    async markCompleted(taskId) {
        const task = await this.get(taskId);
        if (!task) {
            return null;
        }
        const updateData = { status: enums_1.TaskStatus.COMPLETED };
        return this.update(taskId, updateData);
    }
}
exports.TaskService = TaskService;
