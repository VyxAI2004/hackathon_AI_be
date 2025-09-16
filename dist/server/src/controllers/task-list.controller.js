"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskListController = void 0;
class TaskListController {
    constructor(service) {
        this.service = service;
    }
    async createTaskList(req, res) {
        const taskList = await this.service.createTaskList(req.body);
        res.status(201).json(taskList);
    }
    async updateTaskList(req, res) {
        const taskList = await this.service.updateTaskList(req.params.id, req.body);
        if (!taskList)
            return res.status(404).json({ message: "TaskList not found" });
        res.json(taskList);
    }
    async deleteTaskList(req, res) {
        const ok = await this.service.deleteTaskList(req.params.id);
        if (!ok)
            return res.status(404).json({ message: "TaskList not found" });
        res.status(204).send();
    }
    async getByCreator(req, res) {
        const lists = await this.service.getByCreator(req.params.userId);
        res.json(lists);
    }
    async getSharedWithUser(req, res) {
        const lists = await this.service.getSharedWithUser(req.params.userId);
        res.json(lists);
    }
    async getAllForUser(req, res) {
        const lists = await this.service.getAllForUser(req.params.userId);
        res.json(lists);
    }
    async addUser(req, res) {
        const userTaskList = await this.service.addUser(req.params.id, req.body.userId, req.body.permission);
        res.status(201).json(userTaskList);
    }
    async removeUser(req, res) {
        const ok = await this.service.removeUser(req.params.id, req.body.userId);
        if (!ok)
            return res.status(404).json({ message: "User not found in TaskList" });
        res.status(204).send();
    }
    async getTasksInList(req, res) {
        const tasks = await this.service.getTasksInList(req.params.id);
        res.json(tasks);
    }
    async search(req, res) {
        const lists = await this.service.search(req.query.q);
        res.json(lists);
    }
    async countCurrents(req, res) {
        const count = await this.service.countCurrents(req.query.q);
        res.json({ count });
    }
}
exports.TaskListController = TaskListController;
