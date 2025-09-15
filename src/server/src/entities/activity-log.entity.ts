import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity({ name: "activity_logs" })
export class ActivityLog extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 50 })
  action!: string;

  @Column({ type: "uuid", nullable: true })
  target_id?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  target_type?: string;

  @Column({ type: "jsonb", nullable: true })
  log_metadata?: Record<string, any>;
}
