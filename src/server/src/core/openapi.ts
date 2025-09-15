import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { z } from "zod";

// This is the crucial line you were missing!
extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

// --- Schemas ---
// Define Zod schemas for all request/response bodies, queries, and parameters.
// This is the "single source of truth" for your API.

const UserListQuerySchema = z.object({
  q: z.string().optional().describe("Search keyword for username or email"),
  username: z.string().optional().describe("Filter by username"),
  email: z.string().email().optional().describe("Filter by email"),
  skip: z.coerce.number().optional().default(0).describe("Number of items to skip"),
  limit: z.coerce.number().optional().default(100).describe("Number of items to limit"),
});

const UserIdParamsSchema = z.object({
  id: z.string().uuid().describe("The user's unique ID"),
});

const UserEmailParamsSchema = z.object({
  email: z.string().email().describe("The user's unique email address"),
});

const UserCreateBodySchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(1),
});

const UserUpdateBodySchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

const UserResponseSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const UserCountResponseSchema = z.object({
  count: z.number(),
});
  // Login request body schema
  const UserLoginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

// --- Paths ---
// Register each API endpoint and link it to the correct schemas.

  // POST /api/v1/users/auth/login
  registry.registerPath({
    method: "post",
    path: "/api/v1/users/auth/login",
    tags: ["User"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: UserLoginBodySchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Login successful",
        content: {
          "application/json": {
            schema: UserResponseSchema,
          },
        },
      },
      401: { description: "Invalid email or password" },
    },
  });
// GET /api/v1/users
registry.registerPath({
  method: "get",
  path: "/api/v1/users",
  tags: ["User"],
  request: {
    query: UserListQuerySchema,
  },
  responses: {
    200: {
      description: "List users",
      content: {
        "application/json": {
          schema: z.array(UserResponseSchema),
        },
      },
    },
  },
});

// GET /api/v1/users/:id
registry.registerPath({
  method: "get",
  path: "/api/v1/users/{id}",
  tags: ["User"],
  request: {
    params: UserIdParamsSchema,
  },
  responses: {
    200: {
      description: "Get user by ID",
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
    },
    404: { description: "User not found" },
  },
});

// GET /api/v1/users/email/:email
registry.registerPath({
  method: "get",
  path: "/api/v1/users/email/{email}",
  tags: ["User"],
  request: {
    params: UserEmailParamsSchema,
  },
  responses: {
    200: {
      description: "Get user by email",
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
    },
    404: { description: "User not found" },
  },
});

// POST /api/v1/users
registry.registerPath({
  method: "post",
  path: "/api/v1/users",
  tags: ["User"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: UserCreateBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
    },
  },
});

// PATCH /api/v1/users/:id
registry.registerPath({
  method: "patch",
  path: "/api/v1/users/{id}",
  tags: ["User"],
  request: {
    params: UserIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UserUpdateBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User updated",
      content: {
        "application/json": {
          schema: UserResponseSchema,
        },
      },
    },
    404: { description: "User not found" },
  },
});

// DELETE /api/v1/users/:id
registry.registerPath({
  method: "delete",
  path: "/api/v1/users/{id}",
  tags: ["User"],
  request: {
    params: UserIdParamsSchema,
  },
  responses: {
    204: { description: "User deleted" },
    404: { description: "User not found" },
  },
});


// --- Generator and Export ---

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "ToDo API",
    version: "1.0.0",
  },
  paths: registry.paths,
});

export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
}