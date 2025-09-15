import "dotenv/config"; 
import express from "express";
import { AppDataSource } from "./core/db";
import { setupSwagger } from "./core/swagger";
import { createRouters } from "./router";
import userRouterFactory from "./routes/user.router";
import taskRouterFactory from "./routes/task.router";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
  .then(() => {
    const {
      userRouter,
      taskRouter,
      taskListRouter,
      userTaskListRouter,
      commentRouter,
      tagRouter,
      taskTagRouter,
      activityLogRouter,
    } = createRouters(AppDataSource);

    app.use("/api/v1/users", userRouterFactory(AppDataSource));
    app.use("/api/v1/tasks", taskRouterFactory(AppDataSource));
    app.use("/api/v1/task-lists", taskListRouter);
    app.use("/api/v1/user-task-lists", userTaskListRouter);
    app.use("/api/v1/comments", commentRouter);
    app.use("/api/v1/tags", tagRouter);
    app.use("/api/v1/task-tags", taskTagRouter);
    app.use("/api/v1/activity-logs", activityLogRouter);

    setupSwagger(app);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
