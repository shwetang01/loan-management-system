import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  loanId: Types.ObjectId;
  borrowerId: Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: Types.ObjectId;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    loanId: {
      type: Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    utrNumber: {
      type: String,
      required: [true, 'UTR number is required'],
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required'],
      default: Date.now,
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Explicit index (though field is already unique: true in schema definition)
PaymentSchema.index({ utrNumber: 1 }, { unique: true });
PaymentSchema.index({ loanId: 1 });
PaymentSchema.index({ borrowerId: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
