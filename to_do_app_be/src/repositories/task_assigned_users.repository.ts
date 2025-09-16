import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TaskAssignedUser } from '../entities/task-assigned-users.entity';

export class TaskAssignedUserRepository extends BaseRepository<TaskAssignedUser> {
  constructor(repo: Repository<TaskAssignedUser>) {
    super(repo);
  }

  async create(payload: DeepPartial<TaskAssignedUser>): Promise<TaskAssignedUser> {
    const entity = this.repo.create(payload);
    return this.repo.save(entity);
  }

  // Thêm phương thức findOne để truy vấn bản ghi dựa trên điều kiện
  async findOne(filters: FindOptionsWhere<TaskAssignedUser>): Promise<TaskAssignedUser | null> {
    return this.repo.findOne({ where: filters });
  }

  async save(payload: DeepPartial<TaskAssignedUser>): Promise<TaskAssignedUser>;
  async save(payload: DeepPartial<TaskAssignedUser>[]): Promise<TaskAssignedUser[]>;
  async save(payload: DeepPartial<TaskAssignedUser> | DeepPartial<TaskAssignedUser>[]): Promise<TaskAssignedUser | TaskAssignedUser[]> {
    return this.repo.save(payload as any);
  }
  // Thêm phương thức remove để xóa một bản ghi
  async remove(assignment: TaskAssignedUser): Promise<TaskAssignedUser> {
    return this.repo.remove(assignment);
  }
}
