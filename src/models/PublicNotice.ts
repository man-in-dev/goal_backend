import mongoose, { Document, Schema } from 'mongoose';

export interface IPublicNotice extends Document {
  title: string;
  description: string;
  publishDate: Date;
  downloadLink?: string;
  isActive: boolean;
  isPublished: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'exam' | 'admission' | 'general' | 'academic' | 'other';
  tags: string[];
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const publicNoticeSchema = new Schema<IPublicNotice>({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  publishDate: {
    type: Date,
    required: [true, 'Please add a publish date'],
    default: Date.now
  },
  downloadLink: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['exam', 'admission', 'general', 'academic', 'other'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
publicNoticeSchema.index({ publishDate: -1 });
publicNoticeSchema.index({ isActive: 1, isPublished: 1 });
publicNoticeSchema.index({ category: 1 });
publicNoticeSchema.index({ priority: 1 });

// Text search index
publicNoticeSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text'
});

export default mongoose.model<IPublicNotice>('PublicNotice', publicNoticeSchema);

