import { Task } from "../entities/task.entity";
import { Tag } from "../entities/tag.entity";
import { TaskTag } from "../entities/task-tag.entity";
import { TaskTagRepository } from "../repositories/task-tag.repository";
import { BaseService } from "./base.service";
import { DeepPartial } from "typeorm";

export class TaskTagService extends BaseService<TaskTag> {
  protected repo: TaskTagRepository;

  constructor(repo: TaskTagRepository) {
    super(repo);
    this.repo = repo;
  }

  async createTaskTag(payload: DeepPartial<TaskTag>): Promise<TaskTag> {
    return this.create(payload);
  }

  async deleteTaskTag(taskTagId: string): Promise<boolean> {
    return this.delete(taskTagId);
  }

  async getTagsOfTask(taskId: string): Promise<Tag[]> {
    return this.repo.getTagsOfTask(taskId);
  }

  async getTasksOfTag(tagId: string): Promise<Task[]> {
    return this.repo.getTasksOfTag(tagId);
  }
}