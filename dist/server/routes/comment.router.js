"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = commentRouterFactory;
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const comment_service_1 = require("../services/comment.service");
const comment_repository_1 = require("../repositories/comment.repository");
const comment_entity_1 = require("../entities/comment.entity");
function commentRouterFactory(dataSource) {
    const commentRepo = new comment_repository_1.CommentRepository(dataSource.getRepository(comment_entity_1.Comment));
    const commentService = new comment_service_1.CommentService(commentRepo);
    const commentController = new comment_controller_1.CommentController(commentService);
    const router = (0, express_1.Router)();
    const { activityLogMiddleware } = require("../core/activity-log.middleware");
    // Các route GET cụ thể và có nhiều tham số nên được định nghĩa trước
    router.get("/task/:taskId", (req, res) => commentController.getCommentsByTaskId(req, res));
    router.get("/count/:taskId", (req, res) => commentController.countCurrents(req, res));
    // Các route CRUD cơ bản (có tham số chung như :id) được định nghĩa sau
    router.post("/", activityLogMiddleware("CREATE_COMMENT", "Comment"), (req, res) => commentController.createComment(req, res));
    router.put("/:id", activityLogMiddleware("UPDATE_COMMENT", "Comment"), (req, res) => commentController.updateComment(req, res));
    router.delete("/:id", activityLogMiddleware("DELETE_COMMENT", "Comment"), (req, res) => commentController.deleteComment(req, res));
    router.get("/:id", (req, res) => commentController.getComment(req, res));
    return router;
}
