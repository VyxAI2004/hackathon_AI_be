"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const base_service_1 = require("./base.service");
class TagService extends base_service_1.BaseService {
    constructor(repo) {
        super(repo);
        this.repo = repo;
    }
    async getTagByName(name) {
        return this.repo.getTagByName(name);
    }
    async getMultipleTags(skip = 0, limit = 100, filters) {
        return this.repo.getMultipleTags(skip, limit, filters);
    }
    async countCurrents(query) {
        return this.repo.countCurrents(query);
    }
    async createTag(payload) {
        return this.create(payload);
    }
    async updateTag(tagId, payload) {
        const dbTag = await this.get(tagId);
        if (!dbTag) {
            return null;
        }
        return this.update(tagId, payload);
    }
    async deleteTag(tagId) {
        return this.delete(tagId);
    }
}
exports.TagService = TagService;
