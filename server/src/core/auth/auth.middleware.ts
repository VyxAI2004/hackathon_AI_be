import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "./auth.utils";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string' || !decoded.id) {
        return res.status(403).json({ message: "Forbidden: Invalid token payload" });
    }
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    return res.status(403).json({ message: "Forbidden: Token is invalid or expired" });
  }
};