import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendApplication, getHistory } from '../controllers/emailController.js';

const router = Router();

// Protected Email routes
router.use(protect);

router.post('/send', sendApplication);
router.get('/history', getHistory);

export default router;
