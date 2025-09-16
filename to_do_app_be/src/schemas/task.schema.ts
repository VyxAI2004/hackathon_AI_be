import { z } from "zod";
import { TaskPriority, TaskStatus } from "../../shared/enums";
import { taskTagResponseSchema } from "./task-tag.schema";
import { commentResponseSchema } from "./comment.schema";

// ========== CREATE ==========
export const taskCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  due_date: z.date().nullable().optional(),
  task_list_id: z.string().uuid().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
  created_by: z.string().uuid().nullable().optional(),
});

// ========== UPDATE ==========
export const taskUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  due_date: z.date().nullable().optional(),
  task_list_id: z.string().uuid().nullable().optional(),
  assigned_to: z.string().uuid().nullable().optional(),
});

// ========== RESPONSE ==========
export const taskResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.PENDING),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  due_date: z.date().nullable(),
  task_list_id: z.string().uuid().nullable(),
  created_by: z.string().uuid(),
  assigned_to: z.string().uuid().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  tags: z.array(taskTagResponseSchema).default([]),
  comments: z.array(commentResponseSchema).default([]),
});

// ========== LIST RESPONSE ==========
export const listTasksResponseSchema = z.object({
  items: z.array(taskResponseSchema),
  total: z.number().int(),
});

// ========== TYPES ==========
export type TaskCreateDto = z.infer<typeof taskCreateSchema>;
export type TaskUpdateDto = z.infer<typeof taskUpdateSchema>;
export type TaskResponseDto = z.infer<typeof taskResponseSchema>;
export type ListTasksResponseDto = z.infer<typeof listTasksResponseSchema>;
