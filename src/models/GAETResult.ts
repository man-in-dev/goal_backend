import mongoose, { Document, Schema } from 'mongoose';

export interface IGAETResult extends Document {
  rollNo: string;
  studentName: string;
  testName: string;
  tq: number; // Total Questions
  tr: number; // Total Right
  tw: number; // Total Wrong
  tl: number; // Total Left
  pr: number; // Physics Right
  pw: number; // Physics Wrong
  cr: number; // Chemistry Right
  cw: number; // Chemistry Wrong
  mr: number; // Math Right
  mw: number; // Math Wrong
  br: number; // Biology Right
  bw: number; // Biology Wrong
  gkr: number; // GK Right
  gkw: number; // GK Wrong
  totalMarks: number;
  marksPercentage: number;
  scholarship?: string;
  specialDiscount?: string;
  totalFeeOneTime?: number;
  scholarshipAmount?: number;
  totalFeeInstallment?: number;
  scholarshipAmountInstallment?: number;
  testDate: string;
  testCenter?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GAETResultSchema = new Schema<IGAETResult>({
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true,
    index: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    index: true
  },
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
    index: true
  },
  tq: {
    type: Number,
    required: [true, 'Total questions is required'],
    min: [0, 'Total questions cannot be negative']
  },
  tr: {
    type: Number,
    required: [true, 'Total right is required'],
    min: [0, 'Total right cannot be negative']
  },
  tw: {
    type: Number,
    required: [true, 'Total wrong is required'],
    min: [0, 'Total wrong cannot be negative']
  },
  tl: {
    type: Number,
    required: [true, 'Total left is required'],
    min: [0, 'Total left cannot be negative']
  },
  pr: {
    type: Number,
    required: [true, 'Physics right is required'],
    min: [0, 'Physics right cannot be negative']
  },
  pw: {
    type: Number,
    required: [true, 'Physics wrong is required'],
    min: [0, 'Physics wrong cannot be negative']
  },
  cr: {
    type: Number,
    required: [true, 'Chemistry right is required'],
    min: [0, 'Chemistry right cannot be negative']
  },
  cw: {
    type: Number,
    required: [true, 'Chemistry wrong is required'],
    min: [0, 'Chemistry wrong cannot be negative']
  },
  mr: {
    type: Number,
    required: [true, 'Math right is required'],
    min: [0, 'Math right cannot be negative']
  },
  mw: {
    type: Number,
    required: [true, 'Math wrong is required'],
    min: [0, 'Math wrong cannot be negative']
  },
  br: {
    type: Number,
    required: [true, 'Biology right is required'],
    min: [0, 'Biology right cannot be negative']
  },
  bw: {
    type: Number,
    required: [true, 'Biology wrong is required'],
    min: [0, 'Biology wrong cannot be negative']
  },
  gkr: {
    type: Number,
    required: [true, 'GK right is required'],
    min: [0, 'GK right cannot be negative']
  },
  gkw: {
    type: Number,
    required: [true, 'GK wrong is required'],
    min: [0, 'GK wrong cannot be negative']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [0, 'Total marks cannot be negative']
  },
  marksPercentage: {
    type: Number,
    required: [true, 'Marks percentage is required'],
    min: [0, 'Marks percentage cannot be negative'],
    max: [100, 'Marks percentage cannot exceed 100']
  },
  scholarship: {
    type: String,
    trim: true
  },
  specialDiscount: {
    type: String,
    trim: true
  },
  totalFeeOneTime: {
    type: Number,
    min: [0, 'Total fee cannot be negative']
  },
  scholarshipAmount: {
    type: Number,
    min: [0, 'Scholarship amount cannot be negative']
  },
  totalFeeInstallment: {
    type: Number,
    min: [0, 'Total fee installment cannot be negative']
  },
  scholarshipAmountInstallment: {
    type: Number,
    min: [0, 'Scholarship amount installment cannot be negative']
  },
  testDate: {
    type: String,
    required: [true, 'Test date is required'],
    trim: true,
    index: true
  },
  testCenter: {
    type: String,
    trim: true,
    index: true
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
GAETResultSchema.index({ rollNo: 1, testName: 1 });
GAETResultSchema.index({ studentName: 1 });
GAETResultSchema.index({ testName: 1, testDate: -1 });
GAETResultSchema.index({ testCenter: 1 });
GAETResultSchema.index({ marksPercentage: -1 });

export default mongoose.model<IGAETResult>('GAETResult', GAETResultSchema);

