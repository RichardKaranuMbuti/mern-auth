import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      return;
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};