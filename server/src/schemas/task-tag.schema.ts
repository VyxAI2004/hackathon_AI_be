import { z } from "zod";

// ========== CREATE ==========
export const taskTagCreateSchema = z.object({
  task_id: z.string().uuid(),
  tag_id: z.string().uuid(),
});

// ========== UPDATE ==========
export const taskTagUpdateSchema = z.object({}); // hiện tại không có field update

// ========== RESPONSE ==========
export const taskTagResponseSchema = z.object({
  task_id: z.string().uuid(),
  tag_id: z.string().uuid(),
  tag: z.string(),  // tên tag
  task: z.string(), // tên task
});

// ========== TYPES ==========
export type TaskTagCreateDto = z.infer<typeof taskTagCreateSchema>;
export type TaskTagUpdateDto = z.infer<typeof taskTagUpdateSchema>;
export type TaskTagResponseDto = z.infer<typeof taskTagResponseSchema>;
