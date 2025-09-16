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
  
  // Các route cụ thể không có tham số nên đặt trước
  router.get("/permission", (req, res) => userTaskListController.getPermission(req, res));
  
  // Các route có tham số nên đặt sau
  router.get("/user/:userId", (req, res) => userTaskListController.getUserTaskLists(req, res));
  router.get("/task-list/:taskListId", (req, res) => userTaskListController.getTaskListUsers(req, res));
  
  // Các route POST/PUT/DELETE có thể đặt sau cùng, vì chúng không gây ra lỗi khớp đường dẫn
  router.post("/share", (req, res) => userTaskListController.shareTaskList(req, res));

  return router;
}