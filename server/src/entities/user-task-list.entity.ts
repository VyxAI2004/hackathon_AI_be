import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { TaskList } from "./task-list.entity";

@Entity({ name: "user_task_list" })
export class UserTaskList extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => TaskList, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_list_id" })
  taskList!: TaskList;

  @Column({ type: "varchar", length: 10, default: "view" })
  permission!: string;
}
