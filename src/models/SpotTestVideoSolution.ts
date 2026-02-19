import mongoose, { Document, Schema } from 'mongoose';

export interface ISpotTestVideoSolution extends Document {
  testName: string;
  subject: string;
  videoLink?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const spotTestVideoSolutionSchema = new Schema<ISpotTestVideoSolution>({
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
        if (!v) return true;
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

spotTestVideoSolutionSchema.index({ order: 1, isActive: 1 });
spotTestVideoSolutionSchema.index({ testName: 1 });
spotTestVideoSolutionSchema.index({ subject: 1 });

const SpotTestVideoSolution = mongoose.models.SpotTestVideoSolution || mongoose.model<ISpotTestVideoSolution>('SpotTestVideoSolution', spotTestVideoSolutionSchema);

export default SpotTestVideoSolution;
