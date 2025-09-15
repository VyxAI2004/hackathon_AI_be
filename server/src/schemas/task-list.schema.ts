import { z } from "zod";

// ========== CREATE ==========
export const taskListCreateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  created_by: z.string().uuid(),
});

// ========== UPDATE ==========
export const taskListUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
});

// ========== RESPONSE ==========
export const taskListResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  created_by: z.string().uuid(),
});

// ========== LIST RESPONSE ==========
export const listTaskListsResponseSchema = z.object({
  items: z.array(taskListResponseSchema),
  total: z.number().int(),
});

// ========== TYPES ==========
export type TaskListCreateDto = z.infer<typeof taskListCreateSchema>;
export type TaskListUpdateDto = z.infer<typeof taskListUpdateSchema>;
export type TaskListResponseDto = z.infer<typeof taskListResponseSchema>;
export type ListTaskListsResponseDto = z.infer<typeof listTaskListsResponseSchema>;
