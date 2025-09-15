import { Comment } from "../entities/comment.entity";
import { CommentRepository } from "../repositories/comment.repository";
import { BaseService } from "./base.service";

export class CommentService extends BaseService<Comment> {
  protected repo: CommentRepository;

  constructor(repo: CommentRepository) {
    super(repo);
    this.repo = repo;
  }

  async createComment(payload: Partial<Comment>): Promise<Comment> {
    return this.create(payload);
  }

  async updateComment(commentId: string, payload: Partial<Comment>): Promise<Comment | null> {
    const dbComment = await this.get(commentId);
    if (!dbComment) {
      return null;
    }
    return this.update(commentId, payload);
  }

  async deleteComment(commentId: string): Promise<boolean> {
    return this.delete(commentId);
  }

  async getComment(commentId: string): Promise<Comment | null> {
    return this.repo.getComment(commentId);
  }

  async getCommentsByTaskId(taskId: string): Promise<Comment[]> {
    return this.repo.getCommentsByTaskId(taskId);
  }

  async countCurrents(taskId: string): Promise<number> {
    return this.repo.countCurrents(taskId);
  }
}