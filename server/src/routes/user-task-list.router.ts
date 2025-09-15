import { Router } from "express";
import { UserTaskListController } from "../controllers/user-task-list.controller";
import { UserTaskListService } from "../services/user-task-list.service";
import { UserTaskListRepository } from "../repositories/user-task-list.repository";
import { DataSource } from "typeorm";
import { UserTaskList } from "../entities/user-task-list.entity";

export default function userTaskListRouterFactory(dataSource: DataSource) {
  const userTaskListRepo = new UserTaskListRepository(dataSource.getRepository(UserTaskList));
  const userTaskListService = new UserTaskListService(userTaskListRepo);
  const userTaskListController = new UserTaskListController(userTaskListService);

  const router = Router();
  router.get("/user/:userId", (req, res) => userTaskListController.getUserTaskLists(req, res));
  router.get("/task-list/:taskListId", (req, res) => userTaskListController.getTaskListUsers(req, res));
  router.get("/permission", (req, res) => userTaskListController.getPermission(req, res));
  router.post("/share", (req, res) => userTaskListController.shareTaskList(req, res));
  return router;
}
