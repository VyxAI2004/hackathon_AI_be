"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const base_service_1 = require("./base.service");
class CommentService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    async createComment(payload) {
        return this.create(payload);
    }
    async updateComment(commentId, payload) {
        const dbComment = await this.get(commentId);
        if (!dbComment) {
            return null;
        }
        return this.update(commentId, payload);
    }
    async deleteComment(commentId) {
        return this.delete(commentId);
    }
    async getComment(commentId) {
        return this.repo.getComment(commentId);
    }
    async getCommentsByTaskId(taskId) {
        return this.repo.getCommentsByTaskId(taskId);
    }
    async countCurrents(taskId) {
        return this.repo.countCurrents(taskId);
    }
}
exports.CommentService = CommentService;
