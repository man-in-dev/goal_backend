import mongoose, { Document, Schema } from 'mongoose';

export interface IAITSVideoSolution extends Document {
  testName: string;
  subject: string;
  videoLink?: string;
  order: number; // For sorting/ordering
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const aitsVideoSolutionSchema = new Schema<IAITSVideoSolution>({
  testName: {
    type: String,
    required: [true, 'Test name is required'],
    trim: true,
    maxlength: [200, 'Test name cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  videoLink: {
    type: String,
    trim: true,
    maxlength: [500, 'Video link cannot exceed 500 characters'],
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Video link must be a valid URL'
    }
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

// Indexes for better query performance
aitsVideoSolutionSchema.index({ order: 1, isActive: 1 });
aitsVideoSolutionSchema.index({ testName: 1 });
aitsVideoSolutionSchema.index({ subject: 1 });

const AITSVideoSolution = mongoose.models.AITSVideoSolution || mongoose.model<IAITSVideoSolution>('AITSVideoSolution', aitsVideoSolutionSchema);

export default AITSVideoSolution;

