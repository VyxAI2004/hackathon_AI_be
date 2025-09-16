import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { TaskService } from "../services/task.service";
import { TaskRepository } from "../repositories/task.repository";
import { DataSource } from "typeorm";
import { Task } from "../entities/task.entity";
import { authMiddleware } from "../core/auth/auth.middleware";
import { activityLogMiddleware } from "../core/activity-log.middleware";
import { TaskAssignedUser } from "../entities/task-assigned-users.entity";
import { User } from "../entities/user.entity";
import { TaskAssignedUserRepository } from "../repositories/task_assigned_users.repository";
import { UserRepository } from "../repositories/user.repository";

export default function taskRouterFactory(dataSource: DataSource) {
  const taskRepo = new TaskRepository(dataSource.getRepository(Task));
  const taskAssignedUserRepository = new TaskAssignedUserRepository(dataSource.getRepository(TaskAssignedUser));
  const userRepository = new UserRepository(dataSource.getRepository(User));
  const taskService = new TaskService(taskRepo, taskAssignedUserRepository, userRepository);
  const taskController = new TaskController(taskService);

  const router = Router();

  // Định nghĩa các route cụ thể nhất (có từ khóa rõ ràng, không phải tham số) trước
  router.get("/my", authMiddleware, taskController.getMyTasks.bind(taskController));
  router.get("/overdue", (req, res) => taskController.getOverdue(req, res));
  router.get("/stats/status", (req, res) => taskController.getStatsByStatus(req, res));
  router.get("/stats/priority", (req, res) => taskController.getStatsByPriority(req, res));
  router.get("/count", (req, res) => taskController.countCurrents(req, res));

  // Định nghĩa các route có tham số cụ thể sau
  router.get("/assignee/:userId", (req, res) => taskController.getByAssignee(req, res));
  router.get("/task-list/:taskListId", (req, res) => taskController.getByTaskList(req, res));
  router.patch("/assign/:taskId", authMiddleware, activityLogMiddleware("ASSIGN_TASK", "Task"), (req, res) =>
    taskController.assignTask(req, res)
  );
  router.patch("/unassign/:taskId/:userId", authMiddleware, activityLogMiddleware("UNASSIGN_TASK", "Task"), (req, res) =>
    taskController.unassignTask(req, res)
  );

  // Cuối cùng là các route CRUD cơ bản (có tham số chung như :id) và các route chung nhất
  router.get("/:id", (req, res) => taskController.getById(req, res));
  router.patch("/:id", authMiddleware, activityLogMiddleware("UPDATE_TASK", "Task"), (req, res) =>
    taskController.updateTask(req, res)
  );
  router.delete("/:id", authMiddleware, activityLogMiddleware("DELETE_TASK", "Task"), (req, res) =>
    taskController.deleteTask(req, res)
  );
  router.get("/", (req, res) => taskController.search(req, res));
  router.post("/", authMiddleware, activityLogMiddleware("CREATE_TASK", "Task"), (req, res) =>
    taskController.createTask(req, res)
  );

  return router;
}