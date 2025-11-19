import mongoose, { Document, Schema } from 'mongoose';

export interface IGAETDate extends Document {
  date: string; // e.g., "15 April 2023"
  mode: string; // e.g., "Online" or "Offline"
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GAETDateSchema = new Schema<IGAETDate>({
  date: {
    type: String,
    required: [true, 'Date is required'],
    trim: true,
  },
  mode: {
    type: String,
    required: [true, 'Mode is required'],
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for sorting by date
GAETDateSchema.index({ date: 1, createdAt: -1 });

const GAETDate = mongoose.model<IGAETDate>('GAETDate', GAETDateSchema);

export default GAETDate;

