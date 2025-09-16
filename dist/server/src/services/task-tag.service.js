"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTagService = void 0;
const base_service_1 = require("./base.service");
class TaskTagService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    async createTaskTag(payload) {
        return this.create(payload);
    }
    async deleteTaskTag(taskTagId) {
        return this.delete(taskTagId);
    }
    async getTagsOfTask(taskId) {
        return this.repo.getTagsOfTask(taskId);
    }
    async getTasksOfTag(tagId) {
        return this.repo.getTasksOfTag(tagId);
    }
}
exports.TaskTagService = TaskTagService;
