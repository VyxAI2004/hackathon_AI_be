"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRegistry = void 0;
const task_entity_1 = require("../entities/task.entity");
const user_entity_1 = require("../entities/user.entity");
exports.EntityRegistry = {
    Task: task_entity_1.Task,
    User: user_entity_1.User,
    // Project: Project,
    // Comment: Comment,
};
