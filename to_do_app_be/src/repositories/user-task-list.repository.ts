import { Repository } from "typeorm";
import { BaseRepository } from "./base.repository";
import { UserTaskList } from "../entities/user-task-list.entity";
import {Permission } from "../../shared/enums";

export class UserTaskListRepository extends BaseRepository<UserTaskList> {
  constructor(repo: Repository<UserTaskList>) {
    super(repo);
  }

  async getByUser(userId: string): Promise<UserTaskList[]> {
    return this.repo.find({
      where: { user: { id: userId } },
    });
  }

  async getByTaskList(taskListId: string): Promise<UserTaskList[]> {
    return this.repo.find({
      where: { taskList: { id: taskListId } },
    });
  }

    async getPermission(
    userId: string,
    taskListId: string
    ): Promise<Permission | null> {
    const record = await this.repo.findOne({
        where: {
        user: { id: userId },
        taskList: { id: taskListId },
        },
    });

    return record ? (record.permission as Permission) : null;
    }
}