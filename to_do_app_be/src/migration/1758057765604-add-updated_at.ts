import { MigrationInterface, QueryRunner, TableColumn} from 'typeorm';
export class AddUpdatedAtColumn1758057765604 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Thêm updated_at cho task_assigned_users
    await queryRunner.addColumn(
      "task_assigned_users",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        default: "now()",
      })
    );

    // Thêm updated_at cho activity_logs
    await queryRunner.addColumn(
      "activity_logs",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        default: "now()",
      })
    );

    // Thêm updated_at cho notifications
    await queryRunner.addColumn(
      "notifications",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        default: "now()",
      })
    );

    // Thêm updated_at cho attachments
    await queryRunner.addColumn(
      "attachments",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        default: "now()",
      })
    );

    // Thêm updated_at cho calendar_events
    await queryRunner.addColumn(
      "calendar_events",
      new TableColumn({
        name: "updated_at",
        type: "timestamptz",
        default: "now()",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa cột updated_at nếu rollback
    await queryRunner.dropColumn("task_assigned_users", "updated_at");
    await queryRunner.dropColumn("activity_logs", "updated_at");
    await queryRunner.dropColumn("notifications", "updated_at");
    await queryRunner.dropColumn("attachments", "updated_at");
    await queryRunner.dropColumn("calendar_events", "updated_at");
  }
}
