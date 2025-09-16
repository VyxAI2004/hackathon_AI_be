"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsersResponseSchema = exports.userResponseSchema = exports.userUpdateSchema = exports.userCreateSchema = void 0;
const zod_1 = require("zod");
// ========== CREATE ==========
exports.userCreateSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email().max(100),
    password: zod_1.z.string().min(6).max(255), // đặt là password, service sẽ hash
});
// ========== UPDATE ==========
exports.userUpdateSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50).optional(),
    email: zod_1.z.string().email().max(100).optional(),
    password: zod_1.z.string().min(6).max(255).optional(),
});
// ========== RESPONSE ==========
exports.userResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    created_at: zod_1.z.date(),
    updated_at: zod_1.z.date(),
});
// ========== LIST RESPONSE ==========
exports.listUsersResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.userResponseSchema),
    total: zod_1.z.number().int(),
});
