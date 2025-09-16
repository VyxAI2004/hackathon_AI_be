import {
  Repository,
  In,
} from "typeorm";
import { BaseRepository } from "./base.repository";
import { TaskTag } from "../entities/task-tag.entity";
import { Task } from "../entities/task.entity";
import { Tag } from "../entities/tag.entity";

export class TaskTagRepository extends BaseRepository<TaskTag> {
  constructor(repo: Repository<TaskTag>) {
    super(repo);
  }

  async getTagsOfTask(taskId: string): Promise<Tag[]> {
    const taskTags = await this.repo.find({
      where: { task: { id: taskId } },
      relations: ["tag"],
    });

    return taskTags.map((taskTag) => taskTag.tag);
  }

  async getTasksOfTag(tagId: string): Promise<Task[]> {

    const taskRepo = this.repo.manager.getRepository(Task);
    
    return await taskRepo.find({
        where: { taskTags: { tag: { id: tagId } } },
        relations: ["taskTags"],
    });

  }
}