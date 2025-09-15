import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { DataSource } from "typeorm";
import { User } from "../entities/user.entity";

export default function userRouterFactory(dataSource: DataSource) {
  const userRepo = new UserRepository(dataSource.getRepository(User));
  const userService = new UserService(userRepo);
  const userController = new UserController(userService);

  const router = Router();

  // --- User CRUD ---
  router.get("/:id", (req, res) => userController.getUser(req, res));
  router.post("/email/:email", (req, res) => userController.getByEmail(req, res));
  router.get("/", (req, res) => userController.search(req, res));
  const { activityLogMiddleware } = require("../core/activity-log.middleware");
  router.post("/", activityLogMiddleware("CREATE_USER", "User"), (req, res) => userController.createUser(req, res));
  router.patch("/:id", activityLogMiddleware("UPDATE_USER", "User"), (req, res) => userController.updateUser(req, res));
  router.delete("/:id", activityLogMiddleware("DELETE_USER", "User"), (req, res) => userController.deleteUser(req, res));

  // --- Auth routes ---
  router.post("/auth/login", (req, res) => userController.login(req, res));

  // REFRESH TOKEN
  router.post("/auth/refresh-token", (req, res) => userController.refreshToken(req, res));

  // LOGOUT
  router.post("/auth/logout", (req, res) => userController.logout(req, res));

  return router;
}
