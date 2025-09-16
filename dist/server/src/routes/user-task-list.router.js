"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userTaskListRouterFactory;
const express_1 = require("express");
const user_task_list_controller_1 = require("../controllers/user-task-list.controller");
const user_task_list_service_1 = require("../services/user-task-list.service");
const user_task_list_repository_1 = require("../repositories/user-task-list.repository");
const user_task_list_entity_1 = require("../entities/user-task-list.entity");
function userTaskListRouterFactory(dataSource) {
    const userTaskListRepo = new user_task_list_repository_1.UserTaskListRepository(dataSource.getRepository(user_task_list_entity_1.UserTaskList));
    const userTaskListService = new user_task_list_service_1.UserTaskListService(userTaskListRepo);
    const userTaskListController = new user_task_list_controller_1.UserTaskListController(userTaskListService);
    const router = (0, express_1.Router)();
    // Các route cụ thể không có tham số nên đặt trước
    router.get("/permission", (req, res) => userTaskListController.getPermission(req, res));
    // Các route có tham số nên đặt sau
    router.get("/user/:userId", (req, res) => userTaskListController.getUserTaskLists(req, res));
    router.get("/task-list/:taskListId", (req, res) => userTaskListController.getTaskListUsers(req, res));
    // Các route POST/PUT/DELETE có thể đặt sau cùng, vì chúng không gây ra lỗi khớp đường dẫn
    router.post("/share", (req, res) => userTaskListController.shareTaskList(req, res));
    return router;
}
