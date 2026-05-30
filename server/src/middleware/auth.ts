import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret || 'your_super_secret_jwt_key_change_in_production') as JwtPayload;

    if (!decoded || !decoded.userId || !decoded.role) {
      res.status(401).json({ success: false, message: 'Invalid token payload' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
