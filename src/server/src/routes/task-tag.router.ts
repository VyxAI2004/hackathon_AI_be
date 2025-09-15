import { Router } from "express";
import { TaskTagController } from "../controllers/task-tag.controller";
import { TaskTagService } from "../services/task-tag.service";
import { TaskTagRepository } from "../repositories/task-tag.repository";
import { DataSource } from "typeorm";
import { TaskTag } from "../entities/task-tag.entity";

export default function taskTagRouterFactory(dataSource: DataSource) {
  const taskTagRepo = new TaskTagRepository(dataSource.getRepository(TaskTag));
  const taskTagService = new TaskTagService(taskTagRepo);
  const taskTagController = new TaskTagController(taskTagService);

  const router = Router();
  router.post("/", (req, res) => taskTagController.createTaskTag(req, res));
  router.delete("/:id", (req, res) => taskTagController.deleteTaskTag(req, res));
  router.get("/task/:taskId", (req, res) => taskTagController.getTagsOfTask(req, res));
  router.get("/tag/:tagId", (req, res) => taskTagController.getTasksOfTag(req, res));
  return router;
}
