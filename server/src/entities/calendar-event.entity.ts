import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Task } from "./task.entity";

@Entity({ name: "calendar_events" })
export class CalendarEvent extends BaseEntity {
  @ManyToOne(() => Task, { onDelete: "SET NULL" })
  @JoinColumn({ name: "task_id" })
  task?: Task;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "timestamptz" })
  start!: Date;

  @Column({ type: "timestamptz", nullable: true })
  end?: Date;

  @Column({ type: "boolean", default: false })
  all_day!: boolean;
}
