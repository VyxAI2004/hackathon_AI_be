import { Router } from "express";
import { TagController } from "../controllers/tag.controller";
import { TagService } from "../services/tag.service";
import { TagRepository } from "../repositories/tag.repository";
import { DataSource } from "typeorm";
import { Tag } from "../entities/tag.entity";

export default function tagRouterFactory(dataSource: DataSource) {
  const tagRepo = new TagRepository(dataSource.getRepository(Tag));
  const tagService = new TagService(tagRepo);
  const tagController = new TagController(tagService);

  const router = Router();
  router.get("/name/:name", (req, res) => tagController.getTagByName(req, res));
  router.get("/", (req, res) => tagController.getMultipleTags(req, res));
  router.get("/count", (req, res) => tagController.countCurrents(req, res));
  router.post("/", (req, res) => tagController.createTag(req, res));
  router.put("/:id", (req, res) => tagController.updateTag(req, res));
  router.delete("/:id", (req, res) => tagController.deleteTag(req, res));
  return router;
}
