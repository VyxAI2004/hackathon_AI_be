"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const base_repository_1 = require("./base.repository");
class CommentRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    // Lấy tất cả comment theo task_id
    async getCommentsByTaskId(task_id) {
        return await this.repo.find({
            where: { task: { id: task_id } },
            order: { created_at: "ASC" },
        });
    }
    // Lấy 1 comment theo id
    async getComment(comment_id) {
        return await this.get(comment_id);
    }
    // Đếm số comment hiện tại của 1 task
    async countCurrents(task_id) {
        return await this.repo.count({ where: { task: { id: task_id } } });
    }
}
exports.CommentRepository = CommentRepository;
