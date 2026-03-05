import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/auth.js';
import { uploadCV, getMyCVs, deleteCV, setActiveCV, setArchivedCV } from '../controllers/cvController.js';
import { FILE_UPLOAD } from '../config/constants.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (!FILE_UPLOAD.ALLOWED_EXTENSIONS.includes(ext)) {
            return cb(new Error('Invalid file extension'), '');
        }
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `cv-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
    }
};

const upload = multer({
    storage,
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
