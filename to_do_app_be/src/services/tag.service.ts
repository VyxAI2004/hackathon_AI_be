import { Tag } from "../entities/tag.entity";
import { TagRepository } from "../repositories/tag.repository";
import { BaseService } from "./base.service";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class TagService extends BaseService<Tag> {
  protected repo: TagRepository;

  constructor(repo: TagRepository) {
    super(repo);
    this.repo = repo;
  }

  async getTagByName(name: string): Promise<Tag | null> {
    return this.repo.getTagByName(name);
  }

  async getMultipleTags(skip = 0, limit = 100, filters?: object): Promise<Tag[]> {
    return this.repo.getMultipleTags(skip, limit, filters);
  }

  async countCurrents(query?: string): Promise<number> {
    return this.repo.countCurrents(query);
  }


  async createTag(payload: DeepPartial<Tag>): Promise<Tag> {
    return this.create(payload);
  }

  async updateTag(tagId: string, payload: QueryDeepPartialEntity<Tag>): Promise<Tag | null> {
    const dbTag = await this.get(tagId);
    if (!dbTag) {
      return null;
    }
    return this.update(tagId, payload);
  }

  async deleteTag(tagId: string): Promise<boolean> {
    return this.delete(tagId);
  }
}