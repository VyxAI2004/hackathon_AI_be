import { Router } from "express";
import userRouter from "./user.router";
import taskRouter from "./task.router";
import taskListRouter from "./task-list.router";
import userTaskListRouter from "./user-task-list.router";
import commentRouter from "./comment.router";
import tagRouter from "./tag.router";
import taskTagRouter from "./task-tag.router";
import activityLog from "./activity-log.router";

const router = Router();

router.use("/users", userRouter);
router.use("/tasks", taskRouter);
router.use("/task-lists", taskListRouter);
router.use("/user-task-lists", userTaskListRouter);
router.use("/comments", commentRouter);
router.use("/tags", tagRouter);
router.use("/task-tags", taskTagRouter);
router.use("/activity-logs", activityLog);

export default router;
