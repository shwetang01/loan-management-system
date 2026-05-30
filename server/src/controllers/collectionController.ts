import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Loan from '../models/Loan';
import Payment from '../models/Payment';

// GET /api/collection/active
export const getActive = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ status: 'disbursed' })
      .populate('borrowerId', 'name email')
      .populate('profileId')
      .sort({ createdAt: -1 });

    const activeLoans = await Promise.all(
      loans.map(async (loan) => {
        const payments = await Payment.find({ loanId: loan._id }).sort({ paymentDate: -1 });
        return {
          loan,
          payments,
        };
      })
    );

    res.status(200).json(activeLoans);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/collection/:loanId/payment
export const recordPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;
    const { utrNumber, amount, paymentDate } = req.body;

    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!utrNumber || amount === undefined || !paymentDate) {
      res.status(400).json({ success: false, message: 'utrNumber, amount, and paymentDate are required' });
      return;
    }

    const payAmount = Number(amount);
    const payDate = new Date(paymentDate);

    // Validations:
    // 1. amount must be > 0
    if (payAmount <= 0) {
      res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
      return;
    }

    // 2. paymentDate must not be in the future
    if (payDate.getTime() > Date.now()) {
      res.status(400).json({ success: false, message: 'Payment date cannot be in the future' });
      return;
    }

    // 3. utrNumber must be unique across ALL payments (check DB)
    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      res.status(400).json({ success: false, message: 'UTR number already exists' });
      return;
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    if (loan.status !== 'disbursed' && loan.status !== 'closed') {
      res.status(400).json({ success: false, message: 'Loan is not in disbursed/active state for payments' });
      return;
    }

    // 4. amount must not exceed outstandingBalance
    if (payAmount > loan.outstandingBalance) {
      res.status(400).json({
        success: false,
        message: `Payment amount (${payAmount}) exceeds outstanding balance (${loan.outstandingBalance})`,
      });
      return;
    }

    // Create Payment record
    const payment = new Payment({
      loanId: loan._id,
      borrowerId: loan.borrowerId,
      utrNumber,
      amount: payAmount,
      paymentDate: payDate,
      recordedBy: req.user.userId,
    });
    await payment.save();

    // Update loan: totalPaid += amount, outstandingBalance -= amount
    loan.totalPaid = parseFloat((loan.totalPaid + payAmount).toFixed(2));
    loan.outstandingBalance = parseFloat((loan.outstandingBalance - payAmount).toFixed(2));

    // If outstandingBalance <= 0: set loan.status='closed', loan.closedAt=Date.now()
    if (loan.outstandingBalance <= 0) {
      loan.status = 'closed';
      loan.closedAt = new Date();
    }

    await loan.save();

    res.status(201).json({
      loan,
      payment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/collection/:loanId/payments
export const getPaymentsForLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { loanId } = req.params;

    // Check if loan exists
    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ success: false, message: 'Loan not found' });
      return;
    }

    // Return all payments for a loan, sorted by paymentDate desc
    const payments = await Payment.find({ loanId }).sort({ paymentDate: -1 });

    res.status(200).json(payments);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
