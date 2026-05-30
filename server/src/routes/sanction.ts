import { Router } from 'express';
import * as sanctionController from '../controllers/sanctionController';
import { authenticate } from '../middleware/auth';
import { rbac } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(rbac('sanction', 'admin'));

// GET /api/sanction/applications
router.get('/applications', sanctionController.getApplications);

// PATCH /api/sanction/applications/:loanId/approve
router.patch('/applications/:loanId/approve', sanctionController.approveLoan);

// PATCH /api/sanction/applications/:loanId/reject
router.patch('/applications/:loanId/reject', sanctionController.rejectLoan);

export default router;
