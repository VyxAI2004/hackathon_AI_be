// auth.util.ts
import jwt, { Secret, SignOptions } from "jsonwebtoken";

// Lấy biến môi trường và xử lý lỗi ngay từ đầu
export const JWT_SECRET: Secret = process.env.JWT_SECRET || "your_secret_key";
// Sử dụng parseInt() để chuyển đổi giá trị từ string sang number
export const JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN as string, 10) || 3600; 

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

export interface JwtPayload {
  id: string;
  email?: string;
  username?: string;
  type?: "access" | "refresh"; 
}

// Sign token
export const signToken = (payload: Omit<JwtPayload, "iat" | "exp">) => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256",
  };
  return jwt.sign(payload, JWT_SECRET, options);
};

// Verify token
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};