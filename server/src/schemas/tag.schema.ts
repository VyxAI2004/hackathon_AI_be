import { z } from "zod";

// ========== CREATE ==========
export const tagCreateSchema = z.object({
  name: z.string().min(1).max(50),
});

// ========== UPDATE ==========
export const tagUpdateSchema = z.object({
  name: z.string().min(1).max(50),
});

// ========== RESPONSE ==========
export const tagResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

// ========== LIST RESPONSE ==========
export const listTagsResponseSchema = z.object({
  items: z.array(tagResponseSchema),
  total: z.number().int(),
});

// ========== TYPES ==========
export type TagCreateDto = z.infer<typeof tagCreateSchema>;
export type TagUpdateDto = z.infer<typeof tagUpdateSchema>;
export type TagResponseDto = z.infer<typeof tagResponseSchema>;
export type ListTagsResponseDto = z.infer<typeof listTagsResponseSchema>;
