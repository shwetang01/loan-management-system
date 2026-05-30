import { Router } from 'express';
import * as disbursementController from '../controllers/disbursementController';
import { authenticate } from '../middleware/auth';
import { rbac } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(rbac('disbursement', 'admin'));

// GET /api/disbursement/sanctioned
router.get('/sanctioned', disbursementController.getSanctioned);

// PATCH /api/disbursement/:loanId/disburse
router.patch('/:loanId/disburse', disbursementController.disburseLoan);

export default router;
