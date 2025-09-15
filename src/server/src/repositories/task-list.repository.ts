import {
  Repository,
  In,
  Like,
  getRepository,
  DataSource,
} from "typeorm";
import { BaseRepository } from "./base.repository";
import { TaskList } from "../entities/task-list.entity";
import { UserTaskList } from "../entities/user-task-list.entity";
import { Task } from "../entities/task.entity";

export type TaskListFilters = {
  q?: string;
  name?: string;
};

export class TaskListRepository extends BaseRepository<TaskList> {
  constructor(repo: Repository<TaskList>) {
    super(repo);
  }

  async getByCreator(
    userId: string,
    skip = 0,
    limit = 100
  ): Promise<TaskList[]> {
    return this.repo.find({
      where: { createdBy: { id: userId } },
      skip,
      take: limit,
    });
  }

  async getSharedWithUser(
    userId: string,
    skip = 0,
    limit = 100
  ): Promise<TaskList[]> {
    const userTaskListRepo = this.repo.manager.getRepository(UserTaskList);
    const sharedTaskLists = await userTaskListRepo.find({
      where: { user: { id: userId } },
      select: ["taskList"],
    });

    const taskListIds = sharedTaskLists.map((utl) => utl.taskList.id);

    if (taskListIds.length === 0) {
      return [];
    }

    return this.repo.find({
      where: { id: In(taskListIds) },
      skip,
      take: limit,
    });
  }

  async getTasksInList(
    taskListId: string,
    skip = 0,
    limit = 100
  ): Promise<Task[]> {
    // Nếu muốn lấy tasks của một taskList, nên dùng repo của Task để truy vấn theo quan hệ
    const taskRepo = this.repo.manager.getRepository(Task);
    return await taskRepo.find({
      where: { taskList: { id: taskListId } },
      skip,
      take: limit,
      order: { created_at: "DESC" },
    });
  }

  async search(
    filters?: TaskListFilters,
    skip = 0,
    limit = 100
  ): Promise<TaskList[]> {
    const qb = this.repo.createQueryBuilder("task_list");

    if (filters) {
      if (filters.q) {
        qb.andWhere(
          "(task_list.name ILIKE :q OR task_list.description ILIKE :q)",
          { q: `%${filters.q}%` }
        );
      }
      if (filters.name) {
        qb.andWhere("task_list.name ILIKE :name", { name: `%${filters.name}%` });
      }
    }

    qb.skip(skip).take(limit).orderBy("task_list.created_at", "DESC");
    return qb.getMany();
  }

  async countCurrents(filters?: TaskListFilters): Promise<number> {
    const qb = this.repo.createQueryBuilder("task_list");

    if (filters) {
      if (filters.q) {
        qb.andWhere(
          "(task_list.name ILIKE :q OR task_list.description ILIKE :q)",
          { q: `%${filters.q}%` }
        );
      }
      if (filters.name) {
        qb.andWhere("task_list.name ILIKE :name", { name: `%${filters.name}%` });
      }
    }

    return qb.getCount();
  }
}