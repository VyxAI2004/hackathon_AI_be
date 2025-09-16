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
exports.UserTaskList = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const user_entity_1 = require("./user.entity");
const task_list_entity_1 = require("./task-list.entity");
let UserTaskList = class UserTaskList extends base_entity_1.BaseEntity {
};
exports.UserTaskList = UserTaskList;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", user_entity_1.User)
], UserTaskList.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_list_entity_1.TaskList, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "task_list_id" }),
    __metadata("design:type", task_list_entity_1.TaskList)
], UserTaskList.prototype, "taskList", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10, default: "view" }),
    __metadata("design:type", String)
], UserTaskList.prototype, "permission", void 0);
exports.UserTaskList = UserTaskList = __decorate([
    (0, typeorm_1.Entity)({ name: "user_task_list" })
], UserTaskList);
