"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTaskListController = void 0;
class UserTaskListController {
    constructor(service) {
        this.service = service;
    }
    async getUserTaskLists(req, res) {
        const lists = await this.service.getUserTaskLists(req.params.userId);
        res.json(lists);
    }
    async getTaskListUsers(req, res) {
        const users = await this.service.getTaskListUsers(req.params.taskListId);
        res.json(users);
    }
    async getPermission(req, res) {
        const perm = await this.service.getPermission(req.params.userId, req.params.taskListId);
        res.json({ permission: perm });
    }
    async shareTaskList(req, res) {
        const result = await this.service.shareTaskList(req.body);
        res.status(201).json(result);
    }
    async revokeAccess(req, res) {
        const ok = await this.service.revokeAccess(req.body.userId, req.body.taskListId);
        if (!ok)
            return res.status(404).json({ message: "UserTaskList not found" });
        res.status(204).send();
    }
    async updatePermission(req, res) {
        const result = await this.service.updatePermission(req.body.userId, req.body.taskListId, req.body.permission);
        if (!result)
            return res.status(404).json({ message: "UserTaskList not found" });
        res.json(result);
    }
    async checkPermission(req, res) {
        const ok = await this.service.checkPermission(req.body.userId, req.body.taskListId, req.body.required);
        res.json({ allowed: ok });
    }
}
exports.UserTaskListController = UserTaskListController;
