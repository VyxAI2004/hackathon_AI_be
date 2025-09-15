import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@Entity({ name: "attachments" })
export class Attachment extends BaseEntity {
  @ManyToOne(() => Task, { onDelete: "CASCADE" })
  @JoinColumn({ name: "task_id" })
  task!: Task;

  @Column({ type: "varchar", length: 255 })
  filename!: string;

  @Column({ type: "varchar", length: 500 })
  url!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "uploaded_by" })
  uploadedBy!: User;
}
