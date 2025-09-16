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