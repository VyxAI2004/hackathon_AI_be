"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = taskRouterFactory;
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const task_service_1 = require("../services/task.service");
const task_repository_1 = require("../repositories/task.repository");
const task_entity_1 = require("../entities/task.entity");
const auth_middleware_1 = require("../core/auth/auth.middleware");
const activity_log_middleware_1 = require("../core/activity-log.middleware");
const task_assigned_users_entity_1 = require("../entities/task-assigned-users.entity");
const user_entity_1 = require("../entities/user.entity");
const task_assigned_users_repository_1 = require("../repositories/task_assigned_users.repository");
const user_repository_1 = require("../repositories/user.repository");
function taskRouterFactory(dataSource) {
    const taskRepo = new task_repository_1.TaskRepository(dataSource.getRepository(task_entity_1.Task));
    const taskAssignedUserRepository = new task_assigned_users_repository_1.TaskAssignedUserRepository(dataSource.getRepository(task_assigned_users_entity_1.TaskAssignedUser));
    const userRepository = new user_repository_1.UserRepository(dataSource.getRepository(user_entity_1.User));
    const taskService = new task_service_1.TaskService(taskRepo, taskAssignedUserRepository, userRepository);
    const taskController = new task_controller_1.TaskController(taskService);
    const router = (0, express_1.Router)();
    // Định nghĩa các route cụ thể nhất (có từ khóa rõ ràng, không phải tham số) trước
    router.get("/my", auth_middleware_1.authMiddleware, taskController.getMyTasks.bind(taskController));
    router.get("/overdue", (req, res) => taskController.getOverdue(req, res));
    router.get("/stats/status", (req, res) => taskController.getStatsByStatus(req, res));
    router.get("/stats/priority", (req, res) => taskController.getStatsByPriority(req, res));
    router.get("/count", (req, res) => taskController.countCurrents(req, res));
    // Định nghĩa các route có tham số cụ thể sau
    router.get("/assignee/:userId", (req, res) => taskController.getByAssignee(req, res));
    router.get("/task-list/:taskListId", (req, res) => taskController.getByTaskList(req, res));
    router.patch("/assign/:taskId", auth_middleware_1.authMiddleware, (0, activity_log_middleware_1.activityLogMiddleware)("ASSIGN_TASK", "Task"), (req, res) => taskController.assignTask(req, res));
    router.patch("/unassign/:taskId/:userId", auth_middleware_1.authMiddleware, (0, activity_log_middleware_1.activityLogMiddleware)("UNASSIGN_TASK", "Task"), (req, res) => taskController.unassignTask(req, res));
    // Cuối cùng là các route CRUD cơ bản (có tham số chung như :id) và các route chung nhất
    router.get("/:id", (req, res) => taskController.getById(req, res));
    router.patch("/:id", auth_middleware_1.authMiddleware, (0, activity_log_middleware_1.activityLogMiddleware)("UPDATE_TASK", "Task"), (req, res) => taskController.updateTask(req, res));
    router.delete("/:id", auth_middleware_1.authMiddleware, (0, activity_log_middleware_1.activityLogMiddleware)("DELETE_TASK", "Task"), (req, res) => taskController.deleteTask(req, res));
    router.get("/", (req, res) => taskController.search(req, res));
    router.post("/", auth_middleware_1.authMiddleware, (0, activity_log_middleware_1.activityLogMiddleware)("CREATE_TASK", "Task"), (req, res) => taskController.createTask(req, res));
    return router;
}
