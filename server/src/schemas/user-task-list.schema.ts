import { z } from "zod";
import { Permission } from "../../../../shared/enums";

// ========== CREATE ==========
export const userTaskListCreateSchema = z.object({
  user_id: z.string().uuid(),
  task_list_id: z.string().uuid(),
  permission: z.nativeEnum(Permission).default(Permission.VIEW),
});

// ========== RESPONSE ==========
export const userTaskListResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  task_list_id: z.string().uuid(),
  permission: z.nativeEnum(Permission),
});

// ========== TYPES ==========
export type UserTaskListCreateDto = z.infer<typeof userTaskListCreateSchema>;
export type UserTaskListResponseDto = z.infer<typeof userTaskListResponseSchema>;
