import { z } from "zod";

// ========== CREATE ==========
export const commentCreateSchema = z.object({
  user_id: z.string().uuid(),
  task_id: z.string().uuid(),
  content: z.string().min(1).max(1000),
});

// ========== UPDATE ==========
export const commentUpdateSchema = z.object({
  content: z.string().min(1).max(1000),
});

// ========== RESPONSE ==========
export const commentResponseSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  user_id: z.string().uuid(),
  task_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

// ========== LIST RESPONSE ==========
export const listCommentsResponseSchema = z.object({
  items: z.array(commentResponseSchema),
  total: z.number().int(),
});

// ========== TYPES ==========
export type CommentCreateDto = z.infer<typeof commentCreateSchema>;
export type CommentUpdateDto = z.infer<typeof commentUpdateSchema>;
export type CommentResponseDto = z.infer<typeof commentResponseSchema>;
export type ListCommentsResponseDto = z.infer<typeof listCommentsResponseSchema>;
