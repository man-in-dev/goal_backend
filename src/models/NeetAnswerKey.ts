import mongoose, { Document, Schema } from 'mongoose';

export interface INeetAnswerKey extends Document {
  testName: string;
  subject: string;
  pdfLink?: string;
  videoLink?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const neetAnswerKeySchema = new Schema<INeetAnswerKey>({
  testName: {
    type: String,
    trim: true,
    maxlength: [200, 'Test name cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  pdfLink: {
    type: String,
    trim: true,
    maxlength: [500, 'PDF link cannot exceed 500 characters']
  },
  videoLink: {
    type: String,
    trim: true,
    maxlength: [500, 'Video link cannot exceed 500 characters']
  },
  order: {
    type: Number,
    default: 0,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
});

neetAnswerKeySchema.index({ order: 1, isActive: 1 });
neetAnswerKeySchema.index({ testName: 1 });
neetAnswerKeySchema.index({ subject: 1 });

const NeetAnswerKey = mongoose.models.NeetAnswerKey || mongoose.model<INeetAnswerKey>('NeetAnswerKey', neetAnswerKeySchema);

export default NeetAnswerKey;
