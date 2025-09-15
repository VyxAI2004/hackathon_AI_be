// server/core/db.ts
import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
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
  ssl:
    process.env.DB_SSL === "true"
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