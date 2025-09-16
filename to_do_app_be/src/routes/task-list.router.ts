import { Router } from "express";
import { TaskListController } from "../controllers/task-list.controller";
import { TaskListService } from "../services/task-list.service";
import { TaskListRepository } from "../repositories/task-list.repository";
import { DataSource } from "typeorm";
import { TaskList } from "../entities/task-list.entity";

export default function taskListRouterFactory(dataSource: DataSource) {
  const taskListRepo = new TaskListRepository(dataSource.getRepository(TaskList));
  const taskListService = new TaskListService(taskListRepo);
  const taskListController = new TaskListController(taskListService);

  const router = Router();

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