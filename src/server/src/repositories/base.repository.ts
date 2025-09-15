import {
  Repository,
  FindOptionsWhere,
  DeepPartial,
  ObjectLiteral,
} from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  public get manager() {
    return this.repo.manager;
  }

  async get(id: string): Promise<T | null> {
    return await this.repo.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  async getMulti(
    skip = 0,
    limit = 100,
    filters?: FindOptionsWhere<T>
  ): Promise<T[]> {
    return await this.repo.find({
      where: filters,
      skip,
      take: limit,
    });
  }

  async create(payload: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(payload);
    return await this.repo.save(entity);
  }

  async update(
    id: string,
    payload: QueryDeepPartialEntity<T>
  ): Promise<T | null> {
    await this.repo.update(id, payload);
    return this.get(id);
  }

  async delete(id: string): Promise<boolean> {
  const result = await this.repo.delete(id);
  return !!result.affected && result.affected > 0;
  }
}
