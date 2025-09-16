"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = taskTagRouterFactory;
const express_1 = require("express");
const task_tag_controller_1 = require("../controllers/task-tag.controller");
const task_tag_service_1 = require("../services/task-tag.service");
const task_tag_repository_1 = require("../repositories/task-tag.repository");
const task_tag_entity_1 = require("../entities/task-tag.entity");
function taskTagRouterFactory(dataSource) {
    const taskTagRepo = new task_tag_repository_1.TaskTagRepository(dataSource.getRepository(task_tag_entity_1.TaskTag));
    const taskTagService = new task_tag_service_1.TaskTagService(taskTagRepo);
    const taskTagController = new task_tag_controller_1.TaskTagController(taskTagService);
    const router = (0, express_1.Router)();
    // Các route GET với tham số cụ thể nên được định nghĩa đầu tiên
    router.get("/task/:taskId", (req, res) => taskTagController.getTagsOfTask(req, res));
    router.get("/tag/:tagId", (req, res) => taskTagController.getTasksOfTag(req, res));
    // Các route CRUD cơ bản được đặt sau
    router.post("/", (req, res) => taskTagController.createTaskTag(req, res));
    router.delete("/:id", (req, res) => taskTagController.deleteTaskTag(req, res));
    return router;
}
