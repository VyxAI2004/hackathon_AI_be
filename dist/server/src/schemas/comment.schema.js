"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommentsResponseSchema = exports.commentResponseSchema = exports.commentUpdateSchema = exports.commentCreateSchema = void 0;
const zod_1 = require("zod");
// ========== CREATE ==========
exports.commentCreateSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid(),
    task_id: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1).max(1000),
});
// ========== UPDATE ==========
exports.commentUpdateSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(1000),
});
// ========== RESPONSE ==========
exports.commentResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    content: zod_1.z.string(),
    user_id: zod_1.z.string().uuid(),
    task_id: zod_1.z.string().uuid(),
    created_at: zod_1.z.date(),
    updated_at: zod_1.z.date(),
});
// ========== LIST RESPONSE ==========
exports.listCommentsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.commentResponseSchema),
    total: zod_1.z.number().int(),
});
