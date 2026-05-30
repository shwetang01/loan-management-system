import { Router } from 'express';
import * as borrowerController from '../controllers/borrowerController';
import { authenticate } from '../middleware/auth';
import { rbac } from '../middleware/rbac';
import { upload } from '../middleware/upload';

const router = Router();

// Apply auth and borrower role restrictions to all routes below
router.use(authenticate);
router.use(rbac('borrower'));

// POST /api/borrower/profile
router.post('/profile', borrowerController.createOrUpdateProfile);

// POST /api/borrower/upload-salary-slip
router.post(
  '/upload-salary-slip',
  upload.single('salarySlip'),
  borrowerController.uploadSalarySlip
);

// POST /api/borrower/apply
router.post('/apply', borrowerController.applyForLoan);

// GET /api/borrower/my-loan
router.get('/my-loan', borrowerController.getMyLoan);

export default router;
