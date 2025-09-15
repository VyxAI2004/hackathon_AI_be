import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi";
import { Express } from "express";

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}
