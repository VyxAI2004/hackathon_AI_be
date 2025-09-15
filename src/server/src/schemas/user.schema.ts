import { z } from "zod";

// ========== CREATE ==========
export const userCreateSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(6).max(255), // đặt là password, service sẽ hash
});

// ========== UPDATE ==========
export const userUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().min(6).max(255).optional(),
});

// ========== RESPONSE ==========
export const userResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  created_at: z.date(),
  updated_at: z.date(),
});

// ========== LIST RESPONSE ==========
export const listUsersResponseSchema = z.object({
  items: z.array(userResponseSchema),
  total: z.number().int(),
});

// ========== TYPES ==========
export type UserCreateDto = z.infer<typeof userCreateSchema>;
export type UserUpdateDto = z.infer<typeof userUpdateSchema>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;
export type ListUsersResponseDto = z.infer<typeof listUsersResponseSchema>;
