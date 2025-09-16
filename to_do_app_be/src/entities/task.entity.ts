import { Entity, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { TaskList } from "./task-list.entity";
import { TaskTag } from "./task-tag.entity";
import { TaskAssignedUser } from "./task-assigned-users.entity";

@Entity({ name: "tasks" })
export class Task extends BaseEntity {
  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: string;

  @Column({ type: "varchar", length: 20, default: "medium" })
  priority!: string;

  @Column({ type: "timestamptz", nullable: true })
  due_date?: Date;

  @ManyToOne(() => TaskList, { onDelete: "SET NULL" })
  @JoinColumn({ name: "task_list_id" })
  taskList?: TaskList;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "created_by" })
  createdBy!: User;

  @OneToMany(() => TaskTag, (taskTag) => taskTag.task)
  taskTags!: TaskTag[];

  // Quan hệ với bảng trung gian task_assigned_users (giữ lại nếu cần thao tác join table trực tiếp)
  @OneToMany(() => TaskAssignedUser, (taskAssignedUser) => taskAssignedUser.task)
  assignedTaskUsers!: TaskAssignedUser[];

  // Quan hệ ManyToMany trực tiếp với User để lấy mảng User đã assign
  @ManyToMany(() => User, user => user.assignedTasks)
  @JoinTable({
    name: "task_assigned_users",
    joinColumn: { name: "task_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "user_id", referencedColumnName: "id" }
  })
  assignedUsers!: User[];
}
