import { Repository, Like, FindOptionsWhere, In, FindOneOptions } from "typeorm";
import { Task } from "../entities/task.entity";
import { BaseRepository } from "./base.repository";
import { TaskPriority, TaskStatus } from "../../../../shared/enums";
import { LessThan, Not } from "typeorm";
import { TaskAssignedUser } from "../entities/task-assigned-users.entity";


export type TaskFilters = {
  q?: string;
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeIds?: string[];
  created_by?: string;
  due_date?: Date;
};

export type MyTaskFilters = TaskFilters & {
  user_id: string;
  task_list_id?: string;
};

export class TaskRepository extends BaseRepository<Task> {
  constructor(repo: Repository<Task>) {
    super(repo);
  }

  async findOne(options: FindOneOptions<Task>): Promise<Task | null> {
    const opts: FindOneOptions<Task> = {
      ...options,
      relations: Array.isArray(options.relations)
        ? Array.from(new Set([...options.relations, "assignedUsers"]))
        : ["assignedUsers"],
    };
    return this.repo.findOne(opts);
  }

  async search(
    filters?: TaskFilters,
    skip = 0,
    limit = 100
  ): Promise<Task[]> {
    const qb = this.repo.createQueryBuilder("task");

    if (filters) {
      if (filters.q) {
        qb.andWhere(
          "(task.title ILIKE :q OR task.description ILIKE :q)",
          { q: `%${filters.q}%` }
        );
      }
      if (filters.title) {
        qb.andWhere("task.title ILIKE :title", { title: `%${filters.title}%` });
      }
      if (filters.status) {
        qb.andWhere("task.status = :status", { status: filters.status });
      }
      if (filters.priority) {
        qb.andWhere("task.priority = :priority", { priority: filters.priority });
      }
      if (filters.assigneeIds && filters.assigneeIds.length > 0) {
        qb.innerJoin("task.assignedUsers", "assignedUsers")
          .andWhere("assignedUsers.id IN (:...assigneeIds)", { assigneeIds: filters.assigneeIds });
      }
      if (filters.due_date) {
        qb.andWhere("task.due_date = :due_date", { due_date: filters.due_date });
        }
      }

      qb.skip(skip).take(limit).orderBy("task.created_at", "DESC");
      qb.leftJoinAndSelect("task.assignedUsers", "assignedUsers");
      return qb.getMany();
      }

  async getByAssignee(user_id: string, skip = 0, limit = 100): Promise<Task[]> {
    return this.repo
      .createQueryBuilder("task")
      .innerJoin("task.assignedUsers", "assignedUsers")
      .leftJoinAndSelect("task.assignedUsers", "assignedUsersSelect")
      .where("assignedUsers.id = :userId", { userId: user_id })
      .skip(skip)
      .take(limit)
      .orderBy("task.created_at", "DESC")
      .getMany();
  }

  async getOverdue(skip = 0, limit = 100): Promise<Task[]> {
    const now = new Date();
    return this.repo.find({
      where: {
        due_date: LessThan(now),
        status: Not(TaskStatus.COMPLETED),
      },
      skip,
      take: limit,
      order: { due_date: "ASC" },
    });
  }

  async getByTaskList(task_list_id: string, skip = 0, limit = 100): Promise<Task[]> {
    return this.repo.find({
      where: { taskList: { id: task_list_id } },
      skip,
      take: limit,
      order: { created_at: "DESC" },
      relations: ["assignedUsers"],
    });
  }

  async getMyTasks(
      filters: MyTaskFilters,
      skip: number = 0,
      limit: number = 20
  ) {
  const qb = this.repo
    .createQueryBuilder("task")
    .leftJoinAndSelect("task.assignedUsers", "assignedUsers")
    .where("assignedUsers.id = :userId OR task.created_by = :userId", { userId: filters.user_id })
    .distinct(true) // Use this instead of groupBy
    .orderBy("task.created_at", "DESC")
    .skip(skip)
    .take(limit);

    if (filters.task_list_id) {
      qb.andWhere("task.task_list_id = :taskListId", { taskListId: filters.task_list_id });
    }

    const [tasks, total] = await qb.getManyAndCount();

    return { items: tasks, total };
  }

  async getStatsByStatus(): Promise<Record<TaskStatus, number>> {
    const rows = await this.repo
      .createQueryBuilder("task")
      .select("task.status", "status")
      .addSelect("COUNT(task.id)", "count")
      .groupBy("task.status")
      .getRawMany<{ status: TaskStatus; count: string }>();

    return rows.reduce((acc, r) => {
      acc[r.status] = parseInt(r.count, 10);
      return acc;
    }, {} as Record<TaskStatus, number>);
  }

  async getStatsByPriority(): Promise<Record<TaskPriority, number>> {
    const rows = await this.repo
      .createQueryBuilder("task")
      .select("task.priority", "priority")
      .addSelect("COUNT(task.id)", "count")
      .groupBy("task.priority")
      .getRawMany<{ priority: TaskPriority; count: string }>();

    return rows.reduce((acc, r) => {
      acc[r.priority] = parseInt(r.count, 10);
      return acc;
    }, {} as Record<TaskPriority, number>);
  }

  async countCurrents(filters?: TaskFilters): Promise<number> {
    const qb = this.repo.createQueryBuilder("task").select("COUNT(task.id)", "count");

    if (filters) {
      if (filters.q) {
        qb.andWhere("(task.title ILIKE :q OR task.description ILIKE :q)", { q: `%${filters.q}%` });
      }
      if (filters.title) {
        qb.andWhere("task.title ILIKE :title", { title: `%${filters.title}%` });
      }
      if (filters.status) {
        qb.andWhere("task.status = :status", { status: filters.status });
      }
      if (filters.priority) {
        qb.andWhere("task.priority = :priority", { priority: filters.priority });
      }
      if (filters.assigneeIds && filters.assigneeIds.length > 0) {
        qb.innerJoin("task.assignedUsers", "assignedUsers")
          .andWhere("assignedUsers.id IN (:...assigneeIds)", { assigneeIds: filters.assigneeIds });
      }
      if (filters.due_date) {
        qb.andWhere("task.due_date = :due_date", { due_date: filters.due_date });
      }
    }

    const result = await qb.getRawOne<{ count: string }>();
    return parseInt(result?.count || "0", 10);
  }
}
