import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import BorrowerProfile from '../models/BorrowerProfile';
import Loan from '../models/Loan';
import { runBRE } from '../utils/bre';

// POST /api/borrower/profile
export const createOrUpdateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, pan, dateOfBirth, monthlySalary, employmentMode } = req.body;

    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!fullName || !pan || !dateOfBirth || monthlySalary === undefined || !employmentMode) {
      res.status(400).json({ success: false, message: 'Missing profile parameters' });
      return;
    }

    // Run BRE evaluation
    const breResult = runBRE({
      fullName,
      pan,
      dateOfBirth,
      monthlySalary,
      employmentMode,
    });

    if (!breResult.passed) {
      res.status(422).json({
        passed: false,
        reason: breResult.reason || 'BRE criteria validation failed',
      });
      return;
    }

    // Save profile with breStatus='passed'
    let profile = await BorrowerProfile.findOne({ userId: req.user.userId });
    if (profile) {
      profile.fullName = fullName;
      profile.pan = pan;
      profile.dateOfBirth = new Date(dateOfBirth);
      profile.monthlySalary = monthlySalary;
      profile.employmentMode = employmentMode;
      profile.breStatus = 'passed';
      profile.breRejectionReason = undefined;
      await profile.save();
    } else {
      profile = new BorrowerProfile({
        userId: req.user.userId,
        fullName,
        pan,
        dateOfBirth: new Date(dateOfBirth),
        monthlySalary,
        employmentMode,
        breStatus: 'passed',
      });
      await profile.save();
    }

    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/borrower/upload-salary-slip
export const uploadSalarySlip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const profile = await BorrowerProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Borrower profile not found' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded or file rejected by validator' });
      return;
    }

    // Update the profile's salary slip URL
    profile.salarySlipUrl = `/uploads/${req.file.filename}`;
    await profile.save();

    res.status(200).json({ url: profile.salarySlipUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/borrower/apply
export const applyForLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { principalAmount, tenureDays } = req.body;

    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (principalAmount === undefined || tenureDays === undefined) {
      res.status(400).json({ success: false, message: 'Missing principalAmount or tenureDays' });
      return;
    }

    const P = Number(principalAmount);
    const T = Number(tenureDays);

    // Validate principalAmount (50,000–500,000) and tenureDays (30–365)
    if (P < 50000 || P > 500000) {
      res.status(400).json({ success: false, message: 'Principal amount must be between 50,000 and 500,000' });
      return;
    }

    if (T < 30 || T > 365) {
      res.status(400).json({ success: false, message: 'Tenure must be between 30 and 365 days' });
      return;
    }

    // Check borrower has a passed BRE profile and uploaded salary slip
    const profile = await BorrowerProfile.findOne({ userId: req.user.userId });
    if (!profile) {
      res.status(400).json({ success: false, message: 'Borrower profile not found' });
      return;
    }

    if (profile.breStatus !== 'passed') {
      res.status(400).json({ success: false, message: 'Borrower BRE profile status must be passed' });
      return;
    }

    if (!profile.salarySlipUrl) {
      res.status(400).json({ success: false, message: 'Must upload salary slip before applying for loan' });
      return;
    }

    // Calculate SI = (P * 12 * T) / (365 * 100), totalRepayment = P + SI
    const interestRate = 12;
    const simpleInterest = parseFloat(((P * interestRate * T) / (365 * 100)).toFixed(2));
    const totalRepayment = parseFloat((P + simpleInterest).toFixed(2));

    const loan = new Loan({
      borrowerId: req.user.userId,
      profileId: profile._id,
      principalAmount: P,
      tenureDays: T,
      interestRate,
      simpleInterest,
      totalRepayment,
      totalPaid: 0,
      outstandingBalance: totalRepayment,
      status: 'applied',
    });

    await loan.save();

    res.status(201).json(loan);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/borrower/my-loan
export const getMyLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Find the borrower's most recent loan with all fields
    const loan = await Loan.findOne({ borrowerId: req.user.userId }).sort({ createdAt: -1 });

    if (!loan) {
      res.status(404).json({ success: false, message: 'No loan application found' });
      return;
    }

    res.status(200).json(loan);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
