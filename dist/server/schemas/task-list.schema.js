"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTaskListsResponseSchema = exports.taskListResponseSchema = exports.taskListUpdateSchema = exports.taskListCreateSchema = void 0;
const zod_1 = require("zod");
// ========== CREATE ==========
exports.taskListCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().nullable().optional(),
    created_by: zod_1.z.string().uuid(),
});
// ========== UPDATE ==========
exports.taskListUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().nullable().optional(),
});
// ========== RESPONSE ==========
exports.taskListResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    created_by: zod_1.z.string().uuid(),
});
// ========== LIST RESPONSE ==========
exports.listTaskListsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.taskListResponseSchema),
    total: zod_1.z.number().int(),
});
