import userRouterFactory from "./routes/user.router";
import taskRouterFactory from "./routes/task.router";
import taskListRouterFactory from "./routes/task-list.router";
import userTaskListRouterFactory from "./routes/user-task-list.router";
import commentRouterFactory from "./routes/comment.router";
import tagRouterFactory from "./routes/tag.router";
import taskTagRouterFactory from "./routes/task-tag.router";
import activityLogRouterFactory from "./routes/activity-log.router";
import { DataSource } from "typeorm";

export function createRouters(dataSource: DataSource) {
  return {
    userRouter: userRouterFactory(dataSource),
    taskRouter: taskRouterFactory(dataSource),
    taskListRouter: taskListRouterFactory(dataSource),
    userTaskListRouter: userTaskListRouterFactory(dataSource),
    commentRouter: commentRouterFactory(dataSource),
    tagRouter: tagRouterFactory(dataSource),
    taskTagRouter: taskTagRouterFactory(dataSource),
    activityLogRouter: activityLogRouterFactory(dataSource),
  };
}