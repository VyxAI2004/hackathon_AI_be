"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskAssignedUserRepository = void 0;
const base_repository_1 = require("./base.repository");
class TaskAssignedUserRepository extends base_repository_1.BaseRepository {
    constructor(repo) {
        super(repo);
    }
    async create(payload) {
        const entity = this.repo.create(payload);
        return this.repo.save(entity);
    }
    // Thêm phương thức findOne để truy vấn bản ghi dựa trên điều kiện
    async findOne(filters) {
        return this.repo.findOne({ where: filters });
    }
    async save(payload) {
        return this.repo.save(payload);
    }
    // Thêm phương thức remove để xóa một bản ghi
    async remove(assignment) {
        return this.repo.remove(assignment);
    }
}
exports.TaskAssignedUserRepository = TaskAssignedUserRepository;
