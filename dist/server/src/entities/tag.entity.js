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
exports.Tag = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const typeorm_2 = require("typeorm");
const task_tag_entity_1 = require("./task-tag.entity");
let Tag = class Tag extends base_entity_1.BaseEntity {
};
exports.Tag = Tag;
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    (0, typeorm_2.OneToMany)(() => task_tag_entity_1.TaskTag, (taskTag) => taskTag.tag),
    __metadata("design:type", Array)
], Tag.prototype, "taskTags", void 0);
exports.Tag = Tag = __decorate([
    (0, typeorm_1.Entity)({ name: "tags" })
], Tag);
