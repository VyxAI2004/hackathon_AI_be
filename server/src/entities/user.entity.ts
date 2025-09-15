import { Entity, Column, Index, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { comparePassword } from "../core/security";
import { TaskAssignedUser } from "./task-assigned-users.entity"

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column({ type: "varchar", length: 50, unique: true })
  username!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255  })
  passwordHash!: string;

  @OneToMany(() => TaskAssignedUser, (taskAssignedUser) => taskAssignedUser.user)
  assignedTasks!: TaskAssignedUser[];

  async comparePassword(password: string): Promise<boolean> {
    return comparePassword(password, this.passwordHash);
  }
}
