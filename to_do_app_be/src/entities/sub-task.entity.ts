import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Task } from "./task.entity";

@Entity({ name: "sub_tasks" })
export class SubTask extends BaseEntity {
  @ManyToOne(() => Task, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "boolean", default: false })
  completed!: boolean;
}
