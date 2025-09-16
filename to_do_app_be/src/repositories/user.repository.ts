import { Repository, Like, FindOptionsWhere, In } from "typeorm";
import { BaseRepository } from "./base.repository";
import { User } from "../entities/user.entity";

export type UserFilters = {
  q?: string;
  user_id?: string;
  username?: string;
  email?: string;
};

export class UserRepository extends BaseRepository<User> {
  constructor(repo: Repository<User>) {
    super(repo);
  }

  async search(
    filters?: UserFilters,
    skip = 0,
    limit = 100
  ): Promise<User[]> {
    const whereClause: FindOptionsWhere<User>[] = [];

    if (filters) {
      if (filters.q) {
        whereClause.push(
          { username: Like(`%${filters.q}%`) },
          { email: Like(`%${filters.q}%`) }
        );
      }
      if (filters.username) {
        whereClause.push({ username: Like(`%${filters.username}%`) });
      }
      if (filters.email) {
        whereClause.push({ email: Like(`%${filters.email}%`) });
      }
    }

    return this.repo.find({
      where: whereClause,
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

async login(email: string, password: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return null;
    }
    return user;
}

  async countCurrents(filters?: UserFilters): Promise<number> {
    const whereClause: FindOptionsWhere<User>[] = [];

    if (filters) {
      if (filters.q) {
        whereClause.push(
          { username: Like(`%${filters.q}%`) },
          { email: Like(`%${filters.q}%`) }
        );
      }
      if (filters.username) {
        whereClause.push({ username: Like(`%${filters.username}%`) });
      }
      if (filters.email) {
        whereClause.push({ email: Like(`%${filters.email}%`) });
      }
    }

    return this.repo.count({ where: whereClause });
  }
}