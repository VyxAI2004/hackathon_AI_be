import e from "express";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  OWNER = "OWNER",
}
export enum Permission {
    VIEW = "VIEW",
    EDIT = "EDIT",
    ADMIN = "ADMIN",
}