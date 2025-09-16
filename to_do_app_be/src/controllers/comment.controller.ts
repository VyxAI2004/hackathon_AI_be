import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";

export class CommentController {
  constructor(private service: CommentService) {}

  async getCommentsByTaskId(req: Request, res: Response) {
    const comments = await this.service.getCommentsByTaskId(req.params.taskId);
    res.json(comments);
  }

  async getComment(req: Request, res: Response) {
    const comment = await this.service.getComment(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  }

  async countCurrents(req: Request, res: Response) {
    const count = await this.service.countCurrents(req.params.taskId);
    res.json({ count });
  }

  async createComment(req: Request, res: Response) {
    const comment = await this.service.createComment(req.body);
    res.status(201).json(comment);
  }

  async updateComment(req: Request, res: Response) {
    const comment = await this.service.updateComment(req.params.id, req.body);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  }

  async deleteComment(req: Request, res: Response) {
    const ok = await this.service.deleteComment(req.params.id);
    if (!ok) return res.status(404).json({ message: "Comment not found" });
    res.status(204).send();
  }
}
