"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = taskListRouterFactory;
const express_1 = require("express");
const task_list_controller_1 = require("../controllers/task-list.controller");
const task_list_service_1 = require("../services/task-list.service");
const task_list_repository_1 = require("../repositories/task-list.repository");
const task_list_entity_1 = require("../entities/task-list.entity");
function taskListRouterFactory(dataSource) {
    const taskListRepo = new task_list_repository_1.TaskListRepository(dataSource.getRepository(task_list_entity_1.TaskList));
    const taskListService = new task_list_service_1.TaskListService(taskListRepo);
    const taskListController = new task_list_controller_1.TaskListController(taskListService);
    const router = (0, express_1.Router)();
    // Các route cụ thể và có nhiều tham số nên được định nghĩa trước
    router.get("/creator/:userId", (req, res) => taskListController.getByCreator(req, res));
    router.get("/shared/:userId", (req, res) => taskListController.getSharedWithUser(req, res));
    router.get("/all/:userId", (req, res) => taskListController.getAllForUser(req, res));
    // Các route CRUD cơ bản
    router.post("/", (req, res) => taskListController.createTaskList(req, res));
    router.put("/:id", (req, res) => taskListController.updateTaskList(req, res));
    router.delete("/:id", (req, res) => taskListController.deleteTaskList(req, res));
    return router;
}
