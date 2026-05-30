import { Router } from 'express';
import * as collectionController from '../controllers/collectionController';
import { authenticate } from '../middleware/auth';
import { rbac } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(rbac('collection', 'admin'));

// GET /api/collection/active
router.get('/active', collectionController.getActive);

// POST /api/collection/:loanId/payment
router.post('/:loanId/payment', collectionController.recordPayment);

// GET /api/collection/:loanId/payments
router.get('/:loanId/payments', collectionController.getPaymentsForLoan);

export default router;
