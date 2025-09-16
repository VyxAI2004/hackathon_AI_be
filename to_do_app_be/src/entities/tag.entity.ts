import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base.entity";
import { OneToMany } from "typeorm";
import { TaskTag } from "./task-tag.entity";

@Entity({ name: "tags" })
export class Tag extends BaseEntity {
  @Column({ type: "varchar", length: 50, unique: true })
  name!: string;

  @OneToMany(() => TaskTag, (taskTag) => taskTag.tag)
  taskTags!: TaskTag[];
}
