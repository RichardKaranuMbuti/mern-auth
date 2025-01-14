import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import { generateToken } from '../utils/jwt';

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
      return;
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in user registration',
      error: (error as Error).message,
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in user login',
      error: (error as Error).message,
    });
  }
};

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: (error as Error).message,
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { username, email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
        return;
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: (error as Error).message,
    });
  }
};