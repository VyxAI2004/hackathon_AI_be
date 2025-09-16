import { Task } from "../entities/task.entity";
import { MyTaskFilters, TaskRepository } from "../repositories/task.repository";
import { BaseService } from "./base.service";
import { TaskStatus, TaskPriority } from "../../shared/enums";
import { TaskFilters } from "../repositories/task.repository";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TaskAssignedUserRepository } from "../repositories/task_assigned_users.repository";
import { UserRepository } from "../repositories/user.repository";

export class TaskService extends BaseService<Task> {
  protected repo: TaskRepository;
  protected taskAssignedUserRepository: TaskAssignedUserRepository;
  protected userRepository: UserRepository;

  constructor(
    repo: TaskRepository,
    taskAssignedUserRepository: TaskAssignedUserRepository,
    userRepository: UserRepository,
  ) {
    super(repo);
    this.repo = repo;
    this.taskAssignedUserRepository = taskAssignedUserRepository;
    this.userRepository = userRepository;
  }

  // Chức năng tìm kiếm và thống kê
  async search(
    filters?: TaskFilters,
    skip = 0,
    limit = 100
  ): Promise<Task[]> {
    return this.repo.search(filters, skip, limit);
  }

  async getByAssignee(
    userId: string,
    skip = 0,
    limit = 100
  ): Promise<Task[]> {
    return this.repo.getByAssignee(userId, skip, limit);
  }

  async getOverdue(skip = 0, limit = 100): Promise<Task[]> {
    return this.repo.getOverdue(skip, limit);
  }

  async getMyTasks(filters: MyTaskFilters, skip: number, limit: number) {
    return this.repo.getMyTasks(filters, skip, limit);
  }
  
  async getByTaskList(
    taskListId: string,
    skip = 0,
    limit = 100
  ): Promise<Task[]> {
    return this.repo.getByTaskList(taskListId, skip, limit);
  }

  async getStatsByStatus(): Promise<Record<TaskStatus, number>> {
    return this.repo.getStatsByStatus();
  }

  async getById(taskId: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id: taskId } });
  }

  async getStatsByPriority(): Promise<Record<TaskPriority, number>> {
    return this.repo.getStatsByPriority();
  }

  async countCurrents(filters?: TaskFilters): Promise<number> {
    return this.repo.countCurrents(filters);
  }

  // Chức năng CRUD và cập nhật trạng thái
  async createTask(payload: DeepPartial<Task>): Promise<Task> {
    return this.repo.create(payload);
  }

  async updateTask(
    taskId: string, 
    payload: QueryDeepPartialEntity<Task>
  ): Promise<Task | null> {
    return this.update(taskId, payload);
  }

  async assignTask(taskId: string, assigneeIds: string[]): Promise<Task | null> {
    const task = await this.get(taskId);
    if (!task) {
      return null;
    }

    if (task.assignedTaskUsers && task.assignedTaskUsers.length > 0) {
      for (const assignment of task.assignedTaskUsers) {
        await this.taskAssignedUserRepository.remove(assignment);
      }
    }
    for (const assigneeId of assigneeIds) {
      const userToAssign = await this.userRepository.get(assigneeId);
      if (userToAssign) {
        await this.taskAssignedUserRepository.create({
          task_id: taskId,
          user_id: userToAssign.id,
        });
      }
    }
    return this.repo.findOne({ where: { id: taskId }, relations: ["assignedUsers"] });
  }

  async unassignTask(taskId: string, userId: string): Promise<boolean> {
    const assignment = await this.taskAssignedUserRepository.findOne({
      task_id: taskId,
      user_id: userId,
    });

    if (assignment) {
      await this.taskAssignedUserRepository.remove(assignment);
      return true;
    }

    return false;
  }

  async deleteTask(taskId: string): Promise<boolean> {
    return this.delete(taskId);
  }

  async changeStatus(taskId: string, newStatus: TaskStatus): Promise<Task | null> {
    const task = await this.get(taskId);
    if (!task) {
      return null;
    }
    const updateData = { status: newStatus };
    return this.update(taskId, updateData);
  }

  async updatePriority(taskId: string, newPriority: TaskPriority): Promise<Task | null> {
    const task = await this.get(taskId);
    if (!task) {
      return null;
    }
    const updateData = { priority: newPriority };
    return this.update(taskId, updateData);
  }

  async markCompleted(taskId: string): Promise<Task | null> {
    const task = await this.get(taskId);
    if (!task) {
      return null;
    }
    const updateData = { status: TaskStatus.COMPLETED };
    return this.update(taskId, updateData);
  }
}
