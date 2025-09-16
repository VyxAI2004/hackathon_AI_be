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

    // API routes (chỉ sử dụng các biến từ createRouters)
    app.use("/api/v1/users", userRouter); // Sử dụng userRouter từ createRouters
    app.use("/api/v1/tasks", taskRouter); // Sử dụng taskRouter từ createRouters
    app.use("/api/v1/task-lists", taskListRouter);
    app.use("/api/v1/user-task-lists", userTaskListRouter);
    app.use("/api/v1/comments", commentRouter);
    app.use("/api/v1/tags", tagRouter);
    app.use("/api/v1/task-tags", taskTagRouter);
    app.use("/api/v1/activity-logs", activityLogRouter);

    // Swagger
    setupSwagger(app);

    // Serve static frontend (sau khi build FE và copy vào /public)
    const publicPath = path.join(__dirname, "../public");
    app.use(express.static(publicPath));

        // React Router fallback (cho SPA)
    app.get(/(.*)/, (req, res) => {
      res.status(404).send('Not Found');
    });
    
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
