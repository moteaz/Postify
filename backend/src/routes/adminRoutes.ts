import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import {
  getAllUsers,
  getUserDetails,
  deleteUser,
  downloadCV,
  exportUsers,
} from '../controllers/adminController.js';

const router = Router();

router.use(protect);
router.use(requireAdmin as any);

router.get('/users', getAllUsers);
router.get('/users/export', exportUsers);
router.get('/users/:id', getUserDetails);
router.delete('/users/:id', deleteUser);
router.get('/cv/:cvId/download', downloadCV);

export default router;
