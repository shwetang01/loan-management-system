import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';
import BorrowerProfile from '../models/BorrowerProfile';
import Loan from '../models/Loan';

// GET /api/sales/leads
export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch users with role='borrower'
    const borrowers = await User.find({ role: 'borrower' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ role: 'borrower' });

    // Join with BorrowerProfile and Loan information
    const leads = await Promise.all(
      borrowers.map(async (user) => {
        const profile = await BorrowerProfile.findOne({ userId: user._id });
        const loan = await Loan.findOne({ borrowerId: user._id }).sort({ createdAt: -1 });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          breStatus: profile ? profile.breStatus : 'pending',
          salarySlipUploaded: !!(profile && profile.salarySlipUrl),
          loanApplied: !!loan,
          createdAt: user.createdAt,
        };
      })
    );

    res.status(200).json({
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
