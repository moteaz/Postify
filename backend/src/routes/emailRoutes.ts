import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendApplication, getHistory } from '../controllers/emailController.js';
import { validate } from '../middleware/validate.js';
import { sendApplicationSchema } from '../validators/emailValidation.js';

const router = Router();

router.use(protect);

router.post('/send', validate(sendApplicationSchema), sendApplication);
router.get('/history', getHistory);

export default router;
