import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  enquiryId: mongoose.Types.ObjectId;
  transactionId: string; // Unique transaction ID
  orderId: string; // Order ID for ICICI Eazypay
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  paymentMethod?: string;
  paymentGateway: 'icici_eazypay';
  gatewayTransactionId?: string; // Transaction ID from ICICI
  gatewayResponse?: any; // Full response from gateway
  failureReason?: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  course: string;
  returnUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  enquiryId: {
    type: Schema.Types.ObjectId,
    ref: 'AdmissionEnquiry',
    required: true,
    index: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR']
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    type: String
  },
  paymentGateway: {
    type: String,
    default: 'icici_eazypay',
    enum: ['icici_eazypay']
  },
  gatewayTransactionId: {
    type: String,
    index: true
  },
  gatewayResponse: {
    type: Schema.Types.Mixed
  },
  failureReason: {
    type: String
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentPhone: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  returnUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
paymentSchema.index({ enquiryId: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);

