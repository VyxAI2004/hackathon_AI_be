import { Router } from "express";
import { CommentController } from "../controllers/comment.controller";
import { CommentService } from "../services/comment.service";
import { CommentRepository } from "../repositories/comment.repository";
import { DataSource } from "typeorm";
import { Comment } from "../entities/comment.entity";

export default function commentRouterFactory(dataSource: DataSource) {
  const commentRepo = new CommentRepository(dataSource.getRepository(Comment));
  const commentService = new CommentService(commentRepo);
  const commentController = new CommentController(commentService);

  const router = Router();
  const { activityLogMiddleware } = require("../core/activity-log.middleware");
  router.post("/", activityLogMiddleware("CREATE_COMMENT", "Comment"), (req, res) => commentController.createComment(req, res));
  router.put("/:id", activityLogMiddleware("UPDATE_COMMENT", "Comment"), (req, res) => commentController.updateComment(req, res));
  router.delete("/:id", activityLogMiddleware("DELETE_COMMENT", "Comment"), (req, res) => commentController.deleteComment(req, res));
  router.get("/:id", (req, res) => commentController.getComment(req, res));
  router.get("/task/:taskId", (req, res) => commentController.getCommentsByTaskId(req, res));
  router.get("/count/:taskId", (req, res) => commentController.countCurrents(req, res));
  return router;
}
