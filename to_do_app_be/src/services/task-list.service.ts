import { TaskList } from "../entities/task-list.entity";
import { TaskListRepository } from "../repositories/task-list.repository";
import { BaseService } from "./base.service";
import { UserTaskList } from "../entities/user-task-list.entity";
import { Permission } from "../../shared/enums";
import { Task } from "../entities/task.entity";
import { DeepPartial } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export class TaskListService extends BaseService<TaskList> {
  protected repo: TaskListRepository;

  constructor(repo: TaskListRepository) {
    super(repo);
    this.repo = repo;
  }

  // Basic CRUD operations on TaskList
  async createTaskList(payload: DeepPartial<TaskList>): Promise<TaskList> {
    return this.create(payload);
  }

  async updateTaskList(
    taskListId: string,
    payload: QueryDeepPartialEntity<TaskList>
  ): Promise<TaskList | null> {
    const dbTaskList = await this.get(taskListId);
    if (!dbTaskList) {
      return null;
    }
    return this.update(taskListId, payload);
  }

  async deleteTaskList(taskListId: string): Promise<boolean> {
    return this.delete(taskListId);
  }

  // Get task lists based on user
  async getByCreator(userId: string, skip = 0, limit = 100): Promise<TaskList[]> {
    return this.repo.getByCreator(userId, skip, limit);
  }

  async getSharedWithUser(userId: string, skip = 0, limit = 100): Promise<TaskList[]> {
    return this.repo.getSharedWithUser(userId, skip, limit);
  }

  async getAllForUser(userId: string, skip = 0, limit = 100): Promise<TaskList[]> {
    const created = await this.getByCreator(userId);
    const shared = await this.getSharedWithUser(userId);

    const allLists = new Map<string, TaskList>();
    created.forEach((tl) => allLists.set(tl.id, tl));
    shared.forEach((tl) => allLists.set(tl.id, tl));

    const sortedLists = Array.from(allLists.values());
    return sortedLists.slice(skip, skip + limit);
  }

  // User management for a task list
  async addUser(
    taskListId: string,
    userId: string,
    permission: Permission = Permission.VIEW
  ): Promise<UserTaskList> {
  const userTaskListRepo = this.repo.manager.getRepository(UserTaskList);
    const userTask = userTaskListRepo.create({
      taskList: { id: taskListId },
      user: { id: userId },
      permission,
    });
    return userTaskListRepo.save(userTask);
  }

  async removeUser(taskListId: string, userId: string): Promise<boolean> {
  const userTaskListRepo = this.repo.manager.getRepository(UserTaskList);
    const result = await userTaskListRepo.delete({
      taskList: { id: taskListId },
      user: { id: userId },
    });
    return !!result.affected && result.affected > 0;
  }

  // Get tasks within a list
  async getTasksInList(taskListId: string, skip = 0, limit = 100): Promise<Task[]> {
    return this.repo.getTasksInList(taskListId, skip, limit);
  }

  // Search functionality
  async search(query?: string, skip = 0, limit = 100): Promise<TaskList[]> {
  return this.repo.search(query ? { q: query } : undefined, skip, limit);
  }

  async countCurrents(query?: string): Promise<number> {
  return this.repo.countCurrents(query ? { q: query } : undefined);
  }
}