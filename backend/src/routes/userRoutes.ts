import express from 'express';
import {
    getProfile,
    login,
    register,
    updateProfile,
} from '../controllers/userController';

import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;