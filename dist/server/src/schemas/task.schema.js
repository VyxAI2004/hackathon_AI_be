"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTasksResponseSchema = exports.taskResponseSchema = exports.taskUpdateSchema = exports.taskCreateSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../shared/enums");
const task_tag_schema_1 = require("./task-tag.schema");
const comment_schema_1 = require("./comment.schema");
// ========== CREATE ==========
exports.taskCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    description: zod_1.z.string().nullable().optional(),
    status: zod_1.z.nativeEnum(enums_1.TaskStatus).default(enums_1.TaskStatus.PENDING),
    priority: zod_1.z.nativeEnum(enums_1.TaskPriority).default(enums_1.TaskPriority.MEDIUM),
    due_date: zod_1.z.date().nullable().optional(),
    task_list_id: zod_1.z.string().uuid().nullable().optional(),
    assigned_to: zod_1.z.string().uuid().nullable().optional(),
    created_by: zod_1.z.string().uuid().nullable().optional(),
});
// ========== UPDATE ==========
exports.taskUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255).optional(),
    description: zod_1.z.string().nullable().optional(),
    status: zod_1.z.nativeEnum(enums_1.TaskStatus).optional(),
    priority: zod_1.z.nativeEnum(enums_1.TaskPriority).optional(),
    due_date: zod_1.z.date().nullable().optional(),
    task_list_id: zod_1.z.string().uuid().nullable().optional(),
    assigned_to: zod_1.z.string().uuid().nullable().optional(),
});
// ========== RESPONSE ==========
exports.taskResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string(),
    description: zod_1.z.string().nullable(),
    status: zod_1.z.nativeEnum(enums_1.TaskStatus).default(enums_1.TaskStatus.PENDING),
    priority: zod_1.z.nativeEnum(enums_1.TaskPriority).default(enums_1.TaskPriority.MEDIUM),
    due_date: zod_1.z.date().nullable(),
    task_list_id: zod_1.z.string().uuid().nullable(),
    created_by: zod_1.z.string().uuid(),
    assigned_to: zod_1.z.string().uuid().nullable(),
    created_at: zod_1.z.date(),
    updated_at: zod_1.z.date(),
    tags: zod_1.z.array(task_tag_schema_1.taskTagResponseSchema).default([]),
    comments: zod_1.z.array(comment_schema_1.commentResponseSchema).default([]),
});
// ========== LIST RESPONSE ==========
exports.listTasksResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.taskResponseSchema),
    total: zod_1.z.number().int(),
});
