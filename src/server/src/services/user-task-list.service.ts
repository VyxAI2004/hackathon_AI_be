import { UserTaskList } from "../entities/user-task-list.entity";
import { UserTaskListRepository } from "../repositories/user-task-list.repository";
import { BaseService } from "./base.service";
import { Permission } from "../../../../shared/enums";
import { DeepPartial, getRepository } from "typeorm";

export class UserTaskListService extends BaseService<UserTaskList> {
  protected repo: UserTaskListRepository;

  constructor(repo: UserTaskListRepository) {
    super(repo);
    this.repo = repo;
  }

  async checkPermission(
    userId: string,
    taskListId: string,
    required: Permission
  ): Promise<boolean> {
    const perm = await this.getPermission(userId, taskListId);
    if (!perm) {
      return false;
    }
    const priority = {
      [Permission.VIEW]: 1,
      [Permission.EDIT]: 2,
      [Permission.ADMIN]: 3,
    };
    return priority[perm] >= priority[required];
  }

  async getUserTaskLists(userId: string): Promise<UserTaskList[]> {
    return this.repo.getByUser(userId);
  }

  async getTaskListUsers(taskListId: string): Promise<UserTaskList[]> {
    return this.repo.getByTaskList(taskListId);
  }

  async getPermission(
    userId: string,
    taskListId: string
  ): Promise<Permission | null> {
    const perm = await this.repo.getPermission(userId, taskListId);
    return perm;
  }

  async shareTaskList(
    payload: DeepPartial<UserTaskList>
  ): Promise<UserTaskList | null> {
    const existingRecord = await this.repo.getPermission(
      payload.user?.id || "",
      payload.taskList?.id || ""
    );

    if (existingRecord) {
      const userTaskListRepo = this.repo.manager.getRepository(UserTaskList);
      const existingUserTaskList = await userTaskListRepo.findOne({
        where: {
          user: { id: payload.user?.id },
          taskList: { id: payload.taskList?.id },
        },
      });
      if (existingUserTaskList) {
        existingUserTaskList.permission = payload.permission as Permission;
        return userTaskListRepo.save(existingUserTaskList);
      }
    }
    return this.create(payload);
  }

  async revokeAccess(userId: string, taskListId: string): Promise<boolean> {
    const userTaskListRepo = this.repo.manager.getRepository(UserTaskList);
    const result = await userTaskListRepo.delete({
      user: { id: userId },
      taskList: { id: taskListId },
    });
    return !!result.affected && result.affected > 0;
  }

  async updatePermission(
    userId: string,
    taskListId: string,
    newPermission: Permission
  ): Promise<UserTaskList | null> {
    const userTaskListRepo = this.repo.manager.getRepository(UserTaskList);
    const record = await userTaskListRepo.findOne({
      where: {
        user: { id: userId },
        taskList: { id: taskListId },
      },
    });

    if (!record) {
      return null;
    }

    record.permission = newPermission;
    return userTaskListRepo.save(record);
  }
}