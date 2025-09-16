"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = tagRouterFactory;
const express_1 = require("express");
const tag_controller_1 = require("../controllers/tag.controller");
const tag_service_1 = require("../services/tag.service");
const tag_repository_1 = require("../repositories/tag.repository");
const tag_entity_1 = require("../entities/tag.entity");
function tagRouterFactory(dataSource) {
    const tagRepo = new tag_repository_1.TagRepository(dataSource.getRepository(tag_entity_1.Tag));
    const tagService = new tag_service_1.TagService(tagRepo);
    const tagController = new tag_controller_1.TagController(tagService);
    const router = (0, express_1.Router)();
    // The most specific routes (with a named path segment like /count) should come first.
    router.get("/count", (req, res) => tagController.countCurrents(req, res));
    router.get("/name/:name", (req, res) => tagController.getTagByName(req, res));
    // The generic routes (with a path parameter like /:id) come next.
    router.get("/:id", (req, res) => tagController.updateTag(req, res));
    router.put("/:id", (req, res) => tagController.updateTag(req, res));
    router.delete("/:id", (req, res) => tagController.deleteTag(req, res));
    // The most generic routes should come last.
    router.get("/", (req, res) => tagController.getMultipleTags(req, res));
    router.post("/", (req, res) => tagController.createTag(req, res));
    return router;
}
