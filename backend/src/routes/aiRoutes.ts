import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { generateContent } from '../controllers/aiController.js';
import { validate } from '../middleware/validate.js';
import { generateApplicationSchema } from '../validators/aiValidation.js';

const router = Router();

router.use(protect);

router.post('/generate', validate(generateApplicationSchema), generateContent);

export default router;
