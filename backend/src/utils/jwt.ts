import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateToken = (user: IUser): string => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    throw new Error('Invalid token');
  }
};