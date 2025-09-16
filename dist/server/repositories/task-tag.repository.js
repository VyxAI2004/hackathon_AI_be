"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTagRepository = void 0;
const base_repository_1 = require("./base.repository");
const task_entity_1 = require("../entities/task.entity");
class TaskTagRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    async getTagsOfTask(taskId) {
        const taskTags = await this.repo.find({
            where: { task: { id: taskId } },
            relations: ["tag"],
        });
        return taskTags.map((taskTag) => taskTag.tag);
    }
    async getTasksOfTag(tagId) {
        const taskRepo = this.repo.manager.getRepository(task_entity_1.Task);
        return await taskRepo.find({
            where: { taskTags: { tag: { id: tagId } } },
            relations: ["taskTags"],
        });
    }
}
exports.TaskTagRepository = TaskTagRepository;
