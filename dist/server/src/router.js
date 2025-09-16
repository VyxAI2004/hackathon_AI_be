"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouters = createRouters;
const user_router_1 = __importDefault(require("./routes/user.router"));
const task_router_1 = __importDefault(require("./routes/task.router"));
const task_list_router_1 = __importDefault(require("./routes/task-list.router"));
const user_task_list_router_1 = __importDefault(require("./routes/user-task-list.router"));
const comment_router_1 = __importDefault(require("./routes/comment.router"));
const tag_router_1 = __importDefault(require("./routes/tag.router"));
const task_tag_router_1 = __importDefault(require("./routes/task-tag.router"));
const activity_log_router_1 = __importDefault(require("./routes/activity-log.router"));
function createRouters(dataSource) {
    return {
        userRouter: (0, user_router_1.default)(dataSource),
        taskRouter: (0, task_router_1.default)(dataSource),
        taskListRouter: (0, task_list_router_1.default)(dataSource),
        userTaskListRouter: (0, user_task_list_router_1.default)(dataSource),
        commentRouter: (0, comment_router_1.default)(dataSource),
        tagRouter: (0, tag_router_1.default)(dataSource),
        taskTagRouter: (0, task_tag_router_1.default)(dataSource),
        activityLogRouter: (0, activity_log_router_1.default)(dataSource),
    };
}
