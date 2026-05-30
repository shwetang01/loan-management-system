import mongoose, { Schema, Document, Types } from 'mongoose';

export type LoanStatus = 'applied' | 'sanctioned' | 'rejected' | 'disbursed' | 'closed';

export interface ILoan extends Document {
  borrowerId: Types.ObjectId;
  profileId: Types.ObjectId;
  principalAmount: number;
  tenureDays: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  totalPaid: number;
  outstandingBalance: number;
  status: LoanStatus;
  rejectionReason?: string;
  sanctionedAt?: Date;
  disbursedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'BorrowerProfile',
      required: true,
    },
    principalAmount: {
      type: Number,
      required: [true, 'Principal amount is required'],
      min: [50000, 'Principal amount must be at least 50,000'],
      max: [500000, 'Principal amount must not exceed 500,000'],
    },
    tenureDays: {
      type: Number,
      required: [true, 'Tenure in days is required'],
      min: [30, 'Tenure must be at least 30 days'],
      max: [365, 'Tenure must not exceed 365 days'],
    },
    interestRate: {
      type: Number,
      default: 12,
      min: 0,
    },
    simpleInterest: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    outstandingBalance: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'sanctioned', 'rejected', 'disbursed', 'closed'],
      default: 'applied',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    sanctionedAt: Date,
    disbursedAt: Date,
    closedAt: Date,
  },
  { timestamps: true }
);

// Pre-save hook to calculate fields before saving
LoanSchema.pre<ILoan>('validate', function (next) {
  if (this.principalAmount && this.tenureDays) {
    const rate = this.interestRate ?? 12;
    // Simple Interest = (P * R * T) / (365 * 100)
    const calculatedInterest = (this.principalAmount * rate * this.tenureDays) / (365 * 100);
    this.simpleInterest = parseFloat(calculatedInterest.toFixed(2));
    this.totalRepayment = parseFloat((this.principalAmount + this.simpleInterest).toFixed(2));
  }

  // Outstanding Balance = Total Repayment - Total Paid
  const paid = this.totalPaid ?? 0;
  this.outstandingBalance = parseFloat((this.totalRepayment - paid).toFixed(2));

  next();
});

// Indexes requested: index on loanId+status
// Since the _id represents the loanId in Mongo, we index on _id and status.
LoanSchema.index({ _id: 1, status: 1 });
// Also index borrowerId and status as that is a common query pattern
LoanSchema.index({ borrowerId: 1, status: 1 });

export default mongoose.model<ILoan>('Loan', LoanSchema);
