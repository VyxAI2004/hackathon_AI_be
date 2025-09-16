"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const db_1 = require("./core/db");
const swagger_1 = require("./core/swagger");
const router_1 = require("./router");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
db_1.AppDataSource.initialize()
    .then(() => {
    const { userRouter, taskRouter, taskListRouter, userTaskListRouter, commentRouter, tagRouter, taskTagRouter, activityLogRouter, } = (0, router_1.createRouters)(db_1.AppDataSource);
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
    (0, swagger_1.setupSwagger)(app);
    // Serve static frontend (sau khi build FE và copy vào /public)
    const publicPath = path_1.default.join(__dirname, "../public");
    app.use(express_1.default.static(publicPath));
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
