"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialDatabaseSchema1725962309734 = void 0;
const typeorm_1 = require("typeorm");
class InitialDatabaseSchema1725962309734 {
    async up(queryRunner) {
        // 1. Tạo bảng 'users'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'username', type: 'varchar', length: '50', isUnique: true },
                { name: 'email', type: 'varchar', length: '100', isUnique: true },
                { name: 'password_hash', type: 'varchar', length: '255' },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        // 2. Tạo bảng 'task_lists'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_lists',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'name', type: 'varchar', length: '100' },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'created_by', type: 'uuid' },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('task_lists', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // 3. Tạo bảng 'user_task_list'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'user_task_list',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'user_id', type: 'uuid' },
                { name: 'task_list_id', type: 'uuid' },
                { name: 'permission', type: 'varchar', length: '10', default: "'view'" },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('user_task_list', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('user_task_list', new typeorm_1.TableForeignKey({
            columnNames: ['task_list_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'task_lists',
            onDelete: 'CASCADE',
        }));
        // 4. Tạo bảng 'tasks' (đã xóa cột assigned_to)
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tasks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'title', type: 'varchar', length: '255' },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'status', type: 'varchar', length: '20', default: "'pending'" },
                { name: 'priority', type: 'varchar', length: '20', default: "'medium'" },
                { name: 'due_date', type: 'timestamptz', isNullable: true },
                { name: 'task_list_id', type: 'uuid', isNullable: true },
                { name: 'created_by', type: 'uuid' },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('tasks', new typeorm_1.TableForeignKey({
            columnNames: ['task_list_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'task_lists',
            onDelete: 'SET NULL',
        }));
        await queryRunner.createForeignKey('tasks', new typeorm_1.TableForeignKey({
            columnNames: ['created_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // 5. Tạo bảng 'task_assigned_users' (bảng Many-to-Many mới)
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_assigned_users',
            columns: [
                { name: 'task_id', type: 'uuid', isPrimary: true },
                { name: 'user_id', type: 'uuid', isPrimary: true },
            ],
        }));
        await queryRunner.createForeignKey('task_assigned_users', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('task_assigned_users', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // Các bảng còn lại được giữ nguyên
        // 6. Tạo bảng 'comments'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'content', type: 'text' },
                { name: 'task_id', type: 'uuid' },
                { name: 'user_id', type: 'uuid' },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('comments', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('comments', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // 7. Tạo bảng 'tags'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'tags',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'name', type: 'varchar', length: '50', isUnique: true },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        // 8. Tạo bảng 'task_tags'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'task_tags',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'task_id', type: 'uuid' },
                { name: 'tag_id', type: 'uuid' },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('task_tags', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('task_tags', new typeorm_1.TableForeignKey({
            columnNames: ['tag_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tags',
            onDelete: 'CASCADE',
        }));
        // 9. Tạo bảng 'activity_logs'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'activity_logs',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'user_id', type: 'uuid' },
                { name: 'action', type: 'varchar', length: '50' },
                { name: 'target_id', type: 'uuid', isNullable: true },
                { name: 'target_type', type: 'varchar', length: '50', isNullable: true },
                {
                    name: 'log_metadata',
                    type: 'jsonb',
                    isNullable: true,
                },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('activity_logs', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // 10. Tạo bảng 'notifications'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'notifications',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'user_id', type: 'uuid' },
                { name: 'message', type: 'text' },
                { name: 'read', type: 'boolean', default: false },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('notifications', new typeorm_1.TableForeignKey({
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // 11. Tạo bảng 'attachments'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'attachments',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'task_id', type: 'uuid' },
                { name: 'filename', type: 'varchar', length: '255' },
                { name: 'url', type: 'varchar', length: '500' },
                { name: 'uploaded_by', type: 'uuid' },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('attachments', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('attachments', new typeorm_1.TableForeignKey({
            columnNames: ['uploaded_by'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
        // 12. Tạo bảng 'sub_tasks'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'sub_tasks',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'task_id', type: 'uuid' },
                { name: 'title', type: 'varchar', length: '255' },
                { name: 'completed', type: 'boolean', default: false },
                {
                    name: 'created_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
                {
                    name: 'updated_at',
                    type: 'timestamptz',
                    default: 'now()',
                },
            ],
        }));
        await queryRunner.createForeignKey('sub_tasks', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'CASCADE',
        }));
        // 13. Tạo bảng 'calendar_events'
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'calendar_events',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'gen_random_uuid()',
                },
                { name: 'task_id', type: 'uuid', isNullable: true },
                { name: 'title', type: 'varchar', length: '255' },
                { name: 'start', type: 'timestamptz' },
                { name: 'end', type: 'timestamptz', isNullable: true },
                { name: 'all_day', type: 'boolean', default: false },
            ],
        }));
        await queryRunner.createForeignKey('calendar_events', new typeorm_1.TableForeignKey({
            columnNames: ['task_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tasks',
            onDelete: 'SET NULL',
        }));
        // Thêm các index để cải thiện hiệu suất tìm kiếm
        await queryRunner.createIndex("users", new typeorm_1.TableIndex({
            name: "IDX_USER_EMAIL",
            columnNames: ["email"],
            isUnique: true
        }));
        await queryRunner.createIndex("users", new typeorm_1.TableIndex({
            name: "IDX_USER_USERNAME",
            columnNames: ["username"],
            isUnique: true
        }));
    }
    async down(queryRunner) {
        // Xóa tất cả các bảng theo thứ tự ngược lại để tránh lỗi khóa ngoại
        await queryRunner.dropTable('calendar_events');
        await queryRunner.dropTable('sub_tasks');
        await queryRunner.dropTable('attachments');
        await queryRunner.dropTable('notifications');
        await queryRunner.dropTable('activity_logs');
        await queryRunner.dropTable('task_tags');
        await queryRunner.dropTable('tags');
        await queryRunner.dropTable('comments');
        await queryRunner.dropTable('task_assigned_users'); // Xóa bảng Many-to-Many mới
        await queryRunner.dropTable('tasks');
        await queryRunner.dropTable('user_task_list');
        await queryRunner.dropTable('task_lists');
        await queryRunner.dropTable('users');
    }
}
exports.InitialDatabaseSchema1725962309734 = InitialDatabaseSchema1725962309734;
