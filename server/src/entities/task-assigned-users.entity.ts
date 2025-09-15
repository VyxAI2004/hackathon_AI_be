import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from "typeorm";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@Entity({ name: "task_assigned_users" })
export class TaskAssignedUser {
  @PrimaryColumn({ type: "uuid" })
  user_id!: string;

  @PrimaryColumn({ type: "uuid" })
  task_id!: string;

  @ManyToOne(() => User, (user) => user.assignedTasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Task, (task) => task.assignedUsers, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;
}
