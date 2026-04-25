import mongoose, { Document, Schema } from 'mongoose';

export interface INeet2026AnswerKey extends Document {
  subject: string;
  videoLink?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const neet2026AnswerKeySchema = new Schema<INeet2026AnswerKey>({
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

neet2026AnswerKeySchema.index({ order: 1, isActive: 1 });
neet2026AnswerKeySchema.index({ subject: 1 });

const Neet2026AnswerKey = mongoose.models.Neet2026AnswerKey || mongoose.model<INeet2026AnswerKey>('Neet2026AnswerKey', neet2026AnswerKeySchema);

export default Neet2026AnswerKey;
