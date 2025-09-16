"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRouterFactory;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const user_service_1 = require("../services/user.service");
const user_repository_1 = require("../repositories/user.repository");
const user_entity_1 = require("../entities/user.entity");
function userRouterFactory(dataSource) {
    const userRepo = new user_repository_1.UserRepository(dataSource.getRepository(user_entity_1.User));
    const userService = new user_service_1.UserService(userRepo);
    const userController = new user_controller_1.UserController(userService);
    const router = (0, express_1.Router)();
    const { activityLogMiddleware } = require("../core/activity-log.middleware");
    // --- Auth routes (The most specific) ---
    router.post("/auth/login", (req, res) => userController.login(req, res));
    router.post("/auth/refresh-token", (req, res) => userController.refreshToken(req, res));
    router.post("/auth/logout", (req, res) => userController.logout(req, res));
    // --- Specific CRUD routes (using named parameters or fixed paths) ---
    router.post("/email/:email", (req, res) => userController.getByEmail(req, res));
    // --- General CRUD routes (using generic parameters like :id) ---
    router.get("/:id", (req, res) => userController.getUser(req, res));
    router.patch("/:id", activityLogMiddleware("UPDATE_USER", "User"), (req, res) => userController.updateUser(req, res));
    router.delete("/:id", activityLogMiddleware("DELETE_USER", "User"), (req, res) => userController.deleteUser(req, res));
    // --- Catch-all/General routes (The least specific) ---
    router.get("/", (req, res) => userController.search(req, res));
    router.post("/", activityLogMiddleware("CREATE_USER", "User"), (req, res) => userController.createUser(req, res));
    return router;
}
