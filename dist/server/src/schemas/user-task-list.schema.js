"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTaskListResponseSchema = exports.userTaskListCreateSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../shared/enums");
// ========== CREATE ==========
exports.userTaskListCreateSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid(),
    task_list_id: zod_1.z.string().uuid(),
    permission: zod_1.z.nativeEnum(enums_1.Permission).default(enums_1.Permission.VIEW),
});
// ========== RESPONSE ==========
exports.userTaskListResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    user_id: zod_1.z.string().uuid(),
    task_list_id: zod_1.z.string().uuid(),
    permission: zod_1.z.nativeEnum(enums_1.Permission),
});
