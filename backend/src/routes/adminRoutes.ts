import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { getAllUsers, getUserDetails, deleteUser, downloadCV } from '../controllers/adminController.js';

const router = Router();

router.use(protect);
router.use(requireAdmin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.get('/cv/:cvId/download', downloadCV);

export default router;
