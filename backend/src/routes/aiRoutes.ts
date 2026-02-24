import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { generateContent } from '../controllers/aiController.js';

const router = Router();

// Protected AI routes
router.use(protect);

router.post('/generate', generateContent);

export default router;
