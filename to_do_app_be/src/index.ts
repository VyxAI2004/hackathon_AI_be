import "dotenv/config";
import express from "express";
import path from "path";
import { AppDataSource } from "./core/db";
import { setupSwagger } from "./core/swagger";
import { createRouters } from "./router";

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

    // API routes
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/tasks", taskRouter);
    app.use("/api/v1/task-lists", taskListRouter);
    app.use("/api/v1/user-task-lists", userTaskListRouter);
    app.use("/api/v1/comments", commentRouter);
    app.use("/api/v1/tags", tagRouter);
    app.use("/api/v1/task-tags", taskTagRouter);
    app.use("/api/v1/activity-logs", activityLogRouter);

    setupSwagger(app);

    const feDistPath = path.join(__dirname, "../../dist");
    app.use(express.static(feDistPath));
    app.use((req, res) => {
      res.sendFile(path.join(feDistPath, "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });