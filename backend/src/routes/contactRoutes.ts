import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController.js';
import {
  createContactSchema,
  updateContactSchema,
  deleteContactSchema,
} from '../validators/contactValidation.js';

const router = Router();

router.use(protect);

router.get('/', getAllContacts);
router.post('/', validate(createContactSchema), createContact);
router.put('/:id', validate(updateContactSchema), updateContact);
router.delete('/:id', validate(deleteContactSchema), deleteContact);

export default router;
