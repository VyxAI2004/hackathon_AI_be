"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskTagResponseSchema = exports.taskTagUpdateSchema = exports.taskTagCreateSchema = void 0;
const zod_1 = require("zod");
// ========== CREATE ==========
exports.taskTagCreateSchema = zod_1.z.object({
    task_id: zod_1.z.string().uuid(),
    tag_id: zod_1.z.string().uuid(),
});
// ========== UPDATE ==========
exports.taskTagUpdateSchema = zod_1.z.object({}); // hiện tại không có field update
// ========== RESPONSE ==========
exports.taskTagResponseSchema = zod_1.z.object({
    task_id: zod_1.z.string().uuid(),
    tag_id: zod_1.z.string().uuid(),
    tag: zod_1.z.string(), // tên tag
    task: zod_1.z.string(), // tên task
});
