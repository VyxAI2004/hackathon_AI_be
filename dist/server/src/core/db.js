"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// server/core/db.ts
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Không tự động sync, chỉ dùng migration để an toàn cho production
    synchronize: false,
    logging: false,
    // Hỗ trợ cả dev (.ts) và prod (.js sau khi build)
    entities: [__dirname + "/../entities/*.{ts,js}"],
    migrations: [__dirname + "/../migration/*.{ts,js}"],
    subscribers: [],
    // ssl
    ssl: process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
});
// if (process.env.NODE_ENV !== "production") {
//   AppDataSource.initialize()
//     .then(() => {
//       console.log("Database connection established");
//       return AppDataSource.runMigrations();
//     })
//     .then(() => {
//       console.log("Migrations ran successfully");
//     })
//     .catch((error) => {
//       console.error("Error during Data Source initialization or migration:", error);
//     });
// }
