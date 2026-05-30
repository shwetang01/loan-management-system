import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Loan from '../models/Loan';

// GET /api/disbursement/sanctioned
export const getSanctioned = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ status: 'sanctioned' })
      .populate('borrowerId', 'name email')
      .populate('profileId')
      .sort({ createdAt: -1 });

    res.status(200).json(loans);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/disbursement/:loanId/disburse
export const disburseLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan application not found' });
      return;
    }

    if (loan.status !== 'sanctioned') {
      res.status(400).json({ success: false, message: 'Loan status must be sanctioned to disburse' });
      return;
    }

    loan.status = 'disbursed';
    loan.disbursedAt = new Date();
    await loan.save();

    res.status(200).json(loan);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
