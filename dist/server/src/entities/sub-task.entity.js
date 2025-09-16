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
exports.SubTask = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const task_entity_1 = require("./task.entity");
let SubTask = class SubTask extends base_entity_1.BaseEntity {
};
exports.SubTask = SubTask;
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "task_id" }),
    __metadata("design:type", task_entity_1.Task)
], SubTask.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], SubTask.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], SubTask.prototype, "completed", void 0);
exports.SubTask = SubTask = __decorate([
    (0, typeorm_1.Entity)({ name: "sub_tasks" })
], SubTask);
