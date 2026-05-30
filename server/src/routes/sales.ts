import { Router } from 'express';
import * as salesController from '../controllers/salesController';
import { authenticate } from '../middleware/auth';
import { rbac } from '../middleware/rbac';

const router = Router();

router.use(authenticate);
router.use(rbac('sales', 'admin'));

// GET /api/sales/leads
router.get('/leads', salesController.getLeads);

export default router;
