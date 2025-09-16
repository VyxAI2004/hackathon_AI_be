"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
class TaskController {
    constructor(service) {
        this.service = service;
    }
    async search(req, res) {
        const tasks = await this.service.search(req.query);
        res.json(tasks);
    }
    async getByAssignee(req, res) {
        const tasks = await this.service.getByAssignee(req.params.userId);
        res.json(tasks);
    }
    async getById(req, res) {
        const task = await this.service.getById(req.params.id);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        res.json(task);
    }
    async getOverdue(req, res) {
        const tasks = await this.service.getOverdue();
        res.json(tasks);
    }
    async getByTaskList(req, res) {
        const tasks = await this.service.getByTaskList(req.params.taskListId);
        res.json(tasks);
    }
    async getStatsByStatus(req, res) {
        const stats = await this.service.getStatsByStatus();
        res.json(stats);
    }
    async getStatsByPriority(req, res) {
        const stats = await this.service.getStatsByPriority();
        res.json(stats);
    }
    async countCurrents(req, res) {
        const count = await this.service.countCurrents(req.query);
        res.json({ count });
    }
    async createTask(req, res) {
        const user_id = req.user?.id;
        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { title, description, status, priority, due_date, assigneeIds } = req.body;
        const user = { id: user_id };
        const payload = {
            title,
            description,
            status,
            priority,
            due_date,
            createdBy: user,
        };
        try {
            // Create the task first
            const task = await this.service.createTask(payload);
            // Assign users if provided
            if (assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
                await this.service.assignTask(task.id, assigneeIds);
            }
            // Return the task with assigned users
            const result = await this.service.getById(task.id);
            return res.status(201).json(result);
        }
        catch (err) {
            console.error("Error creating task:", err);
            return res.status(500).json({ message: "Task creation failed" });
        }
    }
    async updateTask(req, res) {
        const { assigneeIds, ...updatePayload } = req.body;
        const taskId = req.params.id;
        // Update task fields
        const task = await this.service.updateTask(taskId, updatePayload);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        // Update assigned users if provided
        if (assigneeIds && Array.isArray(assigneeIds)) {
            // Remove all current assignments and re-assign
            await this.service.assignTask(taskId, assigneeIds);
        }
        const result = await this.service.getById(taskId);
        res.json(result);
    }
    async deleteTask(req, res) {
        const ok = await this.service.deleteTask(req.params.id);
        if (!ok)
            return res.status(404).json({ message: "Task not found" });
        res.status(200).send();
    }
    async assignTask(req, res) {
        try {
            const { taskId } = req.params;
            const { assigneeIds } = req.body;
            const updatedTask = await this.service.assignTask(taskId, assigneeIds);
            if (!updatedTask) {
                return res.status(404).json({ message: "Task not found." });
            }
            res.status(200).json(updatedTask);
        }
        catch (e) {
        }
    }
    async unassignTask(req, res) {
        try {
            const { taskId, userId } = req.params;
            const success = await this.service.unassignTask(taskId, userId);
            if (!success) {
                return res.status(404).json({ message: "Assignment not found." });
            }
            res.status(200).send();
        }
        catch (e) {
        }
    }
    async changeStatus(req, res) {
        const task = await this.service.changeStatus(req.params.id, req.body.status);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        res.json(task);
    }
    async updatePriority(req, res) {
        const task = await this.service.updatePriority(req.params.id, req.body.priority);
        if (!task)
            return res.status(404).json({ message: "Task not found" });
        res.json(task);
    }
    async getMyTasks(req, res, next) {
        try {
            const user_id = req.user?.id;
            if (!user_id) {
                return res.status(401).json({ message: "Unauthorized: User ID missing" });
            }
            const skip = parseInt(req.query.skip) || 0;
            const limit = parseInt(req.query.limit) || 20;
            const filters = { user_id };
            const { items, total } = await this.service.getMyTasks(filters, skip, limit);
            res.json({ items, total });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.TaskController = TaskController;
