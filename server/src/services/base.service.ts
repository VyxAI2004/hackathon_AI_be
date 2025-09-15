import { DeepPartial, ObjectLiteral, FindOptionsWhere } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { BaseRepository } from "../repositories/base.repository";

export class BaseService<T extends ObjectLiteral> {
  protected repo: BaseRepository<T>;

  constructor(repo: BaseRepository<T>) {
    this.repo = repo;
  }

  async get(id: string): Promise<T | null> {
    return this.repo.get(id);
  }

  async getMulti(
    skip = 0,
    limit = 100,
    filters?: FindOptionsWhere<T>
  ): Promise<T[]> {
    return this.repo.getMulti(skip, limit, filters);
  }

  async create(payload: DeepPartial<T>): Promise<T> {
    return this.repo.create(payload);
  }

  async update(id: string, payload: QueryDeepPartialEntity<T>): Promise<T | null> {
    return this.repo.update(id, payload);
  }

  async delete(id: string): Promise<boolean> {
  return await this.repo.delete(id);
  }
}
