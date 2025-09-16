"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const typeorm_1 = require("typeorm");
const base_repository_1 = require("./base.repository");
class TagRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    // Lấy 1 tag theo name
    async getTagByName(name) {
        return await this.repo.findOne({ where: { name } });
    }
    // Lấy nhiều tag với skip, limit, optional filter
    async getMultipleTags(skip = 0, limit = 100, filters) {
        const qb = this.repo.createQueryBuilder("tag");
        if (filters?.name) {
            qb.where("tag.name = :name", { name: filters.name });
        }
        return await qb.skip(skip).take(limit).orderBy("tag.name", "ASC").getMany();
    }
    // Đếm số tag hiện tại, có thể filter theo query string
    async countCurrents(query) {
        if (query) {
            return await this.repo.count({
                where: { name: (0, typeorm_1.Like)(`%${query}%`) },
            });
        }
        return await this.repo.count();
    }
}
exports.TagRepository = TagRepository;
