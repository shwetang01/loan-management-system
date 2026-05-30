import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Loan from '../models/Loan';

// GET /api/sanction/applications
export const getApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ status: 'applied' })
      .populate({
        path: 'borrowerId',
        select: 'name email',
      })
      .populate({
        path: 'profileId',
        select: 'pan monthlySalary salarySlipUrl',
      })
      .sort({ createdAt: -1 });

    res.status(200).json(loans);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/sanction/applications/:loanId/approve
export const approveLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan application not found' });
      return;
    }

    if (loan.status !== 'applied') {
      res.status(400).json({ success: false, message: 'Loan status must be applied to sanction' });
      return;
    }

    loan.status = 'sanctioned';
    loan.sanctionedAt = new Date();
    await loan.save();

    res.status(200).json(loan);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/sanction/applications/:loanId/reject
export const rejectLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      res.status(400).json({ success: false, message: 'Rejection reason is required' });
      return;
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan application not found' });
      return;
    }

    if (loan.status !== 'applied') {
      res.status(400).json({ success: false, message: 'Loan status must be applied to reject' });
      return;
    }

    loan.status = 'rejected';
    loan.rejectionReason = rejectionReason;
    await loan.save();

    res.status(200).json(loan);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
