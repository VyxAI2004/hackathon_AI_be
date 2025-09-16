"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListActivityLogsResponseSchema = exports.ActivityLogResponseSchema = exports.ActivityLogUpdateSchema = exports.ActivityLogCreateSchema = void 0;
const zod_extend_1 = require("../core/zod-extend");
// Tạo schema cho UUID
const uuidSchema = zod_extend_1.z.string().uuid();
// ActivityLogCreate
exports.ActivityLogCreateSchema = zod_extend_1.z.object({
    action: zod_extend_1.z.string(),
    user_id: uuidSchema,
    target_id: uuidSchema.optional(),
    target_type: zod_extend_1.z.string().optional(),
    log_metadata: zod_extend_1.z.record(zod_extend_1.z.string(), zod_extend_1.z.unknown()).optional(),
});
// ActivityLogUpdate
exports.ActivityLogUpdateSchema = zod_extend_1.z.object({
    action: zod_extend_1.z.string().optional(),
    target_id: uuidSchema.optional(),
    target_type: zod_extend_1.z.string().optional(),
    log_metadata: zod_extend_1.z.record(zod_extend_1.z.string(), zod_extend_1.z.unknown()).optional(),
});
// ActivityLogResponse
exports.ActivityLogResponseSchema = zod_extend_1.z.object({
    id: uuidSchema,
    user_id: uuidSchema,
    action: zod_extend_1.z.string(),
    target_id: uuidSchema.optional(),
    target_type: zod_extend_1.z.string().optional(),
    log_metadata: zod_extend_1.z.record(zod_extend_1.z.string(), zod_extend_1.z.unknown()).optional(),
    created_at: zod_extend_1.z.coerce.date(),
    updated_at: zod_extend_1.z.coerce.date(),
});
// ListActivityLogsResponse
exports.ListActivityLogsResponseSchema = zod_extend_1.z.object({
    items: zod_extend_1.z.array(exports.ActivityLogResponseSchema),
    total: zod_extend_1.z.number(),
});
