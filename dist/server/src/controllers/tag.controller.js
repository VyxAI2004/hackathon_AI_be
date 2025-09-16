"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
class TagController {
    constructor(service) {
        this.service = service;
    }
    async getTagByName(req, res) {
        const tag = await this.service.getTagByName(req.params.name);
        if (!tag)
            return res.status(404).json({ message: "Tag not found" });
        res.json(tag);
    }
    async getMultipleTags(req, res) {
        const { skip = 0, limit = 100, ...filters } = req.query;
        const tags = await this.service.getMultipleTags(Number(skip), Number(limit), filters);
        res.json(tags);
    }
    async countCurrents(req, res) {
        const count = await this.service.countCurrents(req.query.q);
        res.json({ count });
    }
    async createTag(req, res) {
        const tag = await this.service.createTag(req.body);
        res.status(201).json(tag);
    }
    async updateTag(req, res) {
        const tag = await this.service.updateTag(req.params.id, req.body);
        if (!tag)
            return res.status(404).json({ message: "Tag not found" });
        res.json(tag);
    }
    async deleteTag(req, res) {
        const ok = await this.service.deleteTag(req.params.id);
        if (!ok)
            return res.status(404).json({ message: "Tag not found" });
        res.status(204).send();
    }
}
exports.TagController = TagController;
