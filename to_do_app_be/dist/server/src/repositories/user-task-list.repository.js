"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTaskListRepository = void 0;
const base_repository_1 = require("./base.repository");
class UserTaskListRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    async getByUser(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
        });
    }
    async getByTaskList(taskListId) {
        return this.repo.find({
            where: { taskList: { id: taskListId } },
        });
    }
    async getPermission(userId, taskListId) {
        const record = await this.repo.findOne({
            where: {
                user: { id: userId },
                taskList: { id: taskListId },
            },
        });
        return record ? record.permission : null;
    }
}
exports.UserTaskListRepository = UserTaskListRepository;
