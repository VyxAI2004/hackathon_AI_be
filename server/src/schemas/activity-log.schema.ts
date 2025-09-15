import { z } from "../core/zod-extend";

// Tạo schema cho UUID
const uuidSchema = z.string().uuid();

// ActivityLogCreate
export const ActivityLogCreateSchema = z.object({
  action: z.string(),
  user_id: uuidSchema,
  target_id: uuidSchema.optional(),
  target_type: z.string().optional(),
  log_metadata: z.record(z.string(), z.unknown()).optional(),
});

// ActivityLogUpdate
export const ActivityLogUpdateSchema = z.object({
  action: z.string().optional(),
  target_id: uuidSchema.optional(),
  target_type: z.string().optional(),
  log_metadata: z.record(z.string(), z.unknown()).optional(),
});

// ActivityLogResponse
export const ActivityLogResponseSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  action: z.string(),
  target_id: uuidSchema.optional(),
  target_type: z.string().optional(),
  log_metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// ListActivityLogsResponse
export const ListActivityLogsResponseSchema = z.object({
  items: z.array(ActivityLogResponseSchema),
  total: z.number(),
});