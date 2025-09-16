"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiDocument = void 0;
exports.setupSwagger = setupSwagger;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const zod_1 = require("zod");
// This is the crucial line you were missing!
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
const registry = new zod_to_openapi_1.OpenAPIRegistry();
// --- Schemas ---
// Define Zod schemas for all request/response bodies, queries, and parameters.
// This is the "single source of truth" for your API.
const UserListQuerySchema = zod_1.z.object({
    q: zod_1.z.string().optional().describe("Search keyword for username or email"),
    username: zod_1.z.string().optional().describe("Filter by username"),
    email: zod_1.z.string().email().optional().describe("Filter by email"),
    skip: zod_1.z.coerce.number().optional().default(0).describe("Number of items to skip"),
    limit: zod_1.z.coerce.number().optional().default(100).describe("Number of items to limit"),
});
const UserIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().describe("The user's unique ID"),
});
const UserEmailParamsSchema = zod_1.z.object({
    email: zod_1.z.string().email().describe("The user's unique email address"),
});
const UserCreateBodySchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
const UserUpdateBodySchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50).optional(),
    email: zod_1.z.string().email().optional(),
    password: zod_1.z.string().min(8).optional(),
});
const UserResponseSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    createdAt: zod_1.z.string().datetime(),
    updatedAt: zod_1.z.string().datetime(),
});
const UserCountResponseSchema = zod_1.z.object({
    count: zod_1.z.number(),
});
// Login request body schema
const UserLoginBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
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
                    schema: zod_1.z.array(UserResponseSchema),
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
const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry.definitions);
exports.openApiDocument = generator.generateDocument({
    openapi: "3.0.0",
    info: {
        title: "ToDo API",
        version: "1.0.0",
    },
    paths: registry.paths,
});
function setupSwagger(app) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.openApiDocument));
}
