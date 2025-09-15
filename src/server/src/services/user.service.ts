import { User } from "../entities/user.entity";
import { UserRepository, UserFilters } from "../repositories/user.repository";
import { BaseService } from "./base.service";
import { hashPassword, comparePassword } from "../core/security";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class UserService extends BaseService<User> {
  protected repo: UserRepository;

  constructor(repo: UserRepository) {
    super(repo);
    this.repo = repo;
  }

  // Chức năng lấy user theo email
  async getByEmail(email: string): Promise<User | null> {
    return this.repo.getByEmail(email);
  }

  // Chức năng lấy user theo ID
  async getUser(userId: string): Promise<User | null> {
    return this.get(userId);
  }

  async login(email: string, password: string): Promise<User | null> {
    return this.repo.login(email, password);
  }

  // Chức năng tìm kiếm user với các bộ lọc
  async search(
    filters?: UserFilters,
    skip = 0,
    limit = 100
  ): Promise<User[]> {
    return this.repo.search(filters, skip, limit);
  }

  // Chức năng tạo user mới
  async createUser(payload: DeepPartial<User>): Promise<User> {
    const password = (payload as any).password;
    if (!password) {
      throw new Error("Password is required");
    }
    const hashedPassword = await hashPassword(password);
    const userPayload = { ...payload, passwordHash: hashedPassword };
    delete (userPayload as any).password; // Xóa trường password gốc
    return this.create(userPayload);
  }
  // Chức năng cập nhật thông tin user
  async updateUser(
    userId: string,
    payload: QueryDeepPartialEntity<User>
  ): Promise<User | null> {
    const dbUser = await this.get(userId);
    if (!dbUser) {
      return null;
    }

  if ((payload as any).password) {
    const hashedPassword = await hashPassword((payload as any).password);
    payload.passwordHash = hashedPassword;
    delete (payload as any).password;
  }

    return this.update(userId, payload);
  }

  // Chức năng xóa user
  async deleteUser(userId: string): Promise<boolean> {
    return this.delete(userId);
  }

  // Chức năng đếm số lượng user theo bộ lọc
  async countUsers(filters?: UserFilters): Promise<number> {
    return this.repo.countCurrents(filters);
  }
}