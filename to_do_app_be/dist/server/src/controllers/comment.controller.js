"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
class CommentController {
    constructor(service) {
        this.service = service;
    }
    async getCommentsByTaskId(req, res) {
        const comments = await this.service.getCommentsByTaskId(req.params.taskId);
        res.json(comments);
    }
    async getComment(req, res) {
        const comment = await this.service.getComment(req.params.id);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        res.json(comment);
    }
    async countCurrents(req, res) {
        const count = await this.service.countCurrents(req.params.taskId);
        res.json({ count });
    }
    async createComment(req, res) {
        const comment = await this.service.createComment(req.body);
        res.status(201).json(comment);
    }
    async updateComment(req, res) {
        const comment = await this.service.updateComment(req.params.id, req.body);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });
        res.json(comment);
    }
    async deleteComment(req, res) {
        const ok = await this.service.deleteComment(req.params.id);
        if (!ok)
            return res.status(404).json({ message: "Comment not found" });
        res.status(204).send();
    }
}
exports.CommentController = CommentController;
