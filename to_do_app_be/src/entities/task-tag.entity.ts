import { Entity, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Task } from "./task.entity";
import { Tag } from "./tag.entity";

@Entity({ name: "task_tags" })
export class TaskTag extends BaseEntity {
  @ManyToOne(() => Task, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @ManyToOne(() => Tag, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tag_id" })
  tag!: Tag;
}
