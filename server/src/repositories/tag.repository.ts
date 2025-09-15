import { Repository, Like } from "typeorm";
import { Tag } from "../entities/tag.entity";
import { BaseRepository } from "./base.repository";

export class TagRepository extends BaseRepository<Tag> {
  constructor(repo: Repository<Tag>) {
    super(repo);
  }

  // Lấy 1 tag theo name
  async getTagByName(name: string): Promise<Tag | null> {
    return await this.repo.findOne({ where: { name } });
  }

  // Lấy nhiều tag với skip, limit, optional filter
    async getMultipleTags(
    skip = 0,
    limit = 100,
    filters?: { name?: string }
    ): Promise<Tag[]> {
    const qb = this.repo.createQueryBuilder("tag");

    if (filters?.name) {
        qb.where("tag.name = :name", { name: filters.name });
    }

    return await qb.skip(skip).take(limit).orderBy("tag.name", "ASC").getMany();
    }


  // Đếm số tag hiện tại, có thể filter theo query string
  async countCurrents(query?: string): Promise<number> {
    if (query) {
      return await this.repo.count({
        where: { name: Like(`%${query}%`) },
      });
    }
    return await this.repo.count();
  }
}
