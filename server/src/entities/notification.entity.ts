import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

@Entity({ name: "notifications" })
export class Notification extends BaseEntity {
  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "boolean", default: false })
  read!: boolean;
}
