"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTagsResponseSchema = exports.tagResponseSchema = exports.tagUpdateSchema = exports.tagCreateSchema = void 0;
const zod_1 = require("zod");
// ========== CREATE ==========
exports.tagCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50),
});
// ========== UPDATE ==========
exports.tagUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(50),
});
// ========== RESPONSE ==========
exports.tagResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string(),
});
// ========== LIST RESPONSE ==========
exports.listTagsResponseSchema = zod_1.z.object({
    items: zod_1.z.array(exports.tagResponseSchema),
    total: zod_1.z.number().int(),
});
