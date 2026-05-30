import mongoose, { Schema, Document, Types } from 'mongoose';

export type EmploymentMode = 'salaried' | 'self-employed' | 'unemployed';
export type BREStatus = 'pending' | 'passed' | 'failed';

export interface IBorrowerProfile extends Document {
  userId: Types.ObjectId;
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
  breStatus: BREStatus;
  breRejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowerProfileSchema = new Schema<IBorrowerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    pan: {
      type: String,
      required: [true, 'PAN card is required'],
      uppercase: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    monthlySalary: {
      type: Number,
      required: [true, 'Monthly salary is required'],
      min: 0,
    },
    employmentMode: {
      type: String,
      enum: ['salaried', 'self-employed', 'unemployed'],
      required: true,
    },
    salarySlipUrl: {
      type: String,
      trim: true,
    },
    breStatus: {
      type: String,
      enum: ['pending', 'passed', 'failed'],
      default: 'pending',
    },
    breRejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBorrowerProfile>('BorrowerProfile', BorrowerProfileSchema);
