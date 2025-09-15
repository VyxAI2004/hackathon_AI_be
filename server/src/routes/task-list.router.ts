import { Router } from "express";
import { TaskListController } from "../controllers/task-list.controller";
import { TaskListService } from "../services/task-list.service";
import { TaskListRepository } from "../repositories/task-list.repository";
import { DataSource } from "typeorm";
import { TaskList } from "../entities/task-list.entity";
import { authMiddleware } from "../core/auth/auth.middleware";
import { activityLogMiddleware } from "../core/activity-log.middleware";

export default function taskListRouterFactory(dataSource: DataSource) {
  const taskListRepo = new TaskListRepository(dataSource.getRepository(TaskList));
  const taskListService = new TaskListService(taskListRepo);
  const taskListController = new TaskListController(taskListService);

  const router = Router();
  router.post("/", authMiddleware, activityLogMiddleware("CREATE_TASK", "PROJECT"), (req, res) => taskListController.createTaskList(req, res));
  router.put("/:id", authMiddleware, activityLogMiddleware("UPDATE_TASK", "PROJECT"), (req, res) => taskListController.updateTaskList(req, res));
  router.delete("/:id", authMiddleware, activityLogMiddleware("DELETE_TASK", "PROJECT"), (req, res) => taskListController.deleteTaskList(req, res));
  router.get("/creator/:userId", authMiddleware, (req, res) => taskListController.getByCreator(req, res));
  router.get("/shared/:userId", authMiddleware, (req, res) => taskListController.getSharedWithUser(req, res));
  router.get("/all/:userId", authMiddleware, (req, res) => taskListController.getAllForUser(req, res));
  return router;
}
