import mongoose, { Document, Schema } from 'mongoose';

export interface IResult extends Document {
  course: string;
  testDate: Date;
  rank: number;
  rollNo: string;
  studentName: string;
  tq: number; // Total Questions
  ta: number; // Total Attempted
  tr: number; // Total Right
  tw: number; // Total Wrong
  tl: number; // Total Left
  pr: number; // Physics Right Questions
  pw: number; // Physics Wrong Questions
  cr: number; // Chemistry Right Questions
  cw: number; // Chemistry Wrong Questions
  br: number; // Biology Right Questions
  bw: number; // Biology Wrong Questions
  zr?: number; // Zoology Right Questions (optional)
  zw?: number; // Zoology Wrong Questions (optional)
  totalMarks: number;
  marksPercentage: number;
  wPercentage: number; // Wrong percentage
  percentile: number;
  batch: string;
  branch: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>({
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  },
  testDate: {
    type: Date,
    required: [true, 'Test date is required']
  },
  rank: {
    type: Number,
    required: [true, 'Rank is required'],
    min: [1, 'Rank must be at least 1']
  },
  rollNo: {
    type: String,
    required: [true, 'Roll number is required'],
    trim: true
  },
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  tq: {
    type: Number,
    required: [true, 'Total questions is required'],
    min: [0, 'Total questions cannot be negative']
  },
  ta: {
    type: Number,
    required: [true, 'Total attempted is required'],
    min: [0, 'Total attempted cannot be negative']
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
    required: [true, 'Physics right questions is required'],
    min: [0, 'Physics right questions cannot be negative']
  },
  pw: {
    type: Number,
    required: [true, 'Physics wrong questions is required'],
    min: [0, 'Physics wrong questions cannot be negative']
  },
  cr: {
    type: Number,
    required: [true, 'Chemistry right questions is required'],
    min: [0, 'Chemistry right questions cannot be negative']
  },
  cw: {
    type: Number,
    required: [true, 'Chemistry wrong questions is required'],
    min: [0, 'Chemistry wrong questions cannot be negative']
  },
  br: {
    type: Number,
    required: [true, 'Biology right questions is required'],
    min: [0, 'Biology right questions cannot be negative']
  },
  bw: {
    type: Number,
    required: [true, 'Biology wrong questions is required'],
    min: [0, 'Biology wrong questions cannot be negative']
  },
  zr: {
    type: Number,
    min: [0, 'Zoology right questions cannot be negative']
  },
  zw: {
    type: Number,
    min: [0, 'Zoology wrong questions cannot be negative']
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
  wPercentage: {
    type: Number,
    required: [true, 'Wrong percentage is required'],
    min: [0, 'Wrong percentage cannot be negative'],
    max: [100, 'Wrong percentage cannot exceed 100']
  },
  percentile: {
    type: Number,
    required: [true, 'Percentile is required'],
    min: [0, 'Percentile cannot be negative'],
    max: [100, 'Percentile cannot exceed 100']
  },
  batch: {
    type: String,
    required: [true, 'Batch is required'],
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
  },
  uploadedBy: {
    type: String,
    required: [true, 'Uploaded by is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ResultSchema.index({ course: 1, testDate: -1 });
ResultSchema.index({ rollNo: 1 });
ResultSchema.index({ studentName: 1 });
ResultSchema.index({ rank: 1 });
ResultSchema.index({ batch: 1, branch: 1 });

export default mongoose.model<IResult>('Result', ResultSchema);
