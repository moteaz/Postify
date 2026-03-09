import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.js';
import {
  uploadCV,
  getMyCVs,
  deleteCV,
  setActiveCV,
  setArchivedCV,
} from '../controllers/cvController.js';
import { FILE_UPLOAD } from '../config/constants.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const fileFilter = (req: any, file: Express.Multer.File, cb: any): void => {
  if (FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype as any)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: FILE_UPLOAD.MAX_SIZE },
});

router.use(protect);

router.post('/upload', uploadLimiter, upload.single('cv'), uploadCV);
router.get('/', getMyCVs);
router.delete('/:id', deleteCV);
router.put('/:id/active', setActiveCV);
router.put('/:id/archive', setArchivedCV);

export default router;
