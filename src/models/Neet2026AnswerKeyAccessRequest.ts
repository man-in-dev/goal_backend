import mongoose, { Document, Schema } from 'mongoose';

export interface INeet2026AnswerKeyAccessRequest extends Document {
  name: string;
  mobileNo: string;
  whatsappNo: string;
  deviceId: string;
  ipAddress: string;
  userAgent?: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const neet2026AnswerKeyAccessRequestSchema = new Schema<INeet2026AnswerKeyAccessRequest>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    mobileNo: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Mobile number must be a valid 10-digit number'],
    },
    whatsappNo: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'WhatsApp number must be a valid 10-digit number'],
    },
    deviceId: {
      type: String,
      required: [true, 'Device ID is required'],
      trim: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: [true, 'IP address is required'],
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
      trim: true,
      maxlength: [500, 'User agent cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'approved',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

neet2026AnswerKeyAccessRequestSchema.index({ deviceId: 1, ipAddress: 1 });

const Neet2026AnswerKeyAccessRequest =
  mongoose.models.NEET2026AnswerKeyAccessRequest ||
  mongoose.model<INeet2026AnswerKeyAccessRequest>(
    'NEET2026AnswerKeyAccessRequest',
    neet2026AnswerKeyAccessRequestSchema
  );

export default Neet2026AnswerKeyAccessRequest;
