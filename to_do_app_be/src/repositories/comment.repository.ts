import { Repository } from "typeorm";
import { Comment } from "../entities/comment.entity";
import { BaseRepository } from "./base.repository";

export class CommentRepository extends BaseRepository<Comment> {
  constructor(repo: Repository<Comment>) {
    super(repo);
  }

  // Lấy tất cả comment theo task_id
  async getCommentsByTaskId(task_id: string): Promise<Comment[]> {
    return await this.repo.find({
    where: { task: { id: task_id } },
    order: { created_at: "ASC" },
    });
  }

  // Lấy 1 comment theo id
  async getComment(comment_id: string): Promise<Comment | null> {
    return await this.get(comment_id);
  }

  // Đếm số comment hiện tại của 1 task
  async countCurrents(task_id: string): Promise<number> {
    return await this.repo.count({ where: { task: { id: task_id } } });
  }
}
