"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const task_list_entity_1 = require("./task-list.entity");
const task_tag_entity_1 = require("./task-tag.entity");
const task_assigned_users_entity_1 = require("./task-assigned-users.entity");
let Task = class Task extends base_entity_1.BaseEntity {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "pending" }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, default: "medium" }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamptz", nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_list_entity_1.TaskList, { onDelete: "SET NULL" }),
    (0, typeorm_1.JoinColumn)({ name: "task_list_id" }),
    __metadata("design:type", task_list_entity_1.TaskList)
], Task.prototype, "taskList", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "created_by" }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_tag_entity_1.TaskTag, (taskTag) => taskTag.task),
    __metadata("design:type", Array)
], Task.prototype, "taskTags", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_assigned_users_entity_1.TaskAssignedUser, (taskAssignedUser) => taskAssignedUser.task),
    __metadata("design:type", Array)
], Task.prototype, "assignedTaskUsers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, user => user.assignedTasks),
    (0, typeorm_1.JoinTable)({
        name: "task_assigned_users",
        joinColumn: { name: "task_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
    }),
    __metadata("design:type", Array)
], Task.prototype, "assignedUsers", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)({ name: "tasks" })
], Task);
