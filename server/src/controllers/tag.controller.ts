import { Request, Response } from "express";
import { TagService } from "../services/tag.service";

export class TagController {
  constructor(private service: TagService) {}

  async getTagByName(req: Request, res: Response) {
    const tag = await this.service.getTagByName(req.params.name);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  }

  async getMultipleTags(req: Request, res: Response) {
    const { skip = 0, limit = 100, ...filters } = req.query;
    const tags = await this.service.getMultipleTags(
      Number(skip),
      Number(limit),
      filters
    );
    res.json(tags);
  }

  async countCurrents(req: Request, res: Response) {
    const count = await this.service.countCurrents(req.query.q as string);
    res.json({ count });
  }

  async createTag(req: Request, res: Response) {
    const tag = await this.service.createTag(req.body);
    res.status(201).json(tag);
  }

  async updateTag(req: Request, res: Response) {
    const tag = await this.service.updateTag(req.params.id, req.body);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  }

  async deleteTag(req: Request, res: Response) {
    const ok = await this.service.deleteTag(req.params.id);
    if (!ok) return res.status(404).json({ message: "Tag not found" });
    res.status(204).send();
  }
}
