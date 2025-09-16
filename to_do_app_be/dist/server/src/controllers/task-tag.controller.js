"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTagController = void 0;
class TaskTagController {
    constructor(service) {
        this.service = service;
    }
    async createTaskTag(req, res) {
        const taskTag = await this.service.createTaskTag(req.body);
        res.status(201).json(taskTag);
    }
    async deleteTaskTag(req, res) {
        const ok = await this.service.deleteTaskTag(req.params.id);
        if (!ok)
            return res.status(404).json({ message: 'TaskTag not found' });
        res.status(204).send();
    }
    async getTagsOfTask(req, res) {
        const tags = await this.service.getTagsOfTask(req.params.taskId);
        res.json(tags);
    }
    async getTasksOfTag(req, res) {
        const tasks = await this.service.getTasksOfTag(req.params.tagId);
        res.json(tasks);
    }
}
exports.TaskTagController = TaskTagController;
