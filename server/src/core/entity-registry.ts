import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";

export const EntityRegistry: Record<string, any> = {
  Task,
  User,
  // Project: Project,
  // Comment: Comment,
};
