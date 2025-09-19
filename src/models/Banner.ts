import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  mobileImageUrl?: string;
  mobileImageAlt?: string;
  linkUrl?: string;
  position: 'hero' | 'sidebar' | 'footer' | 'popup' | 'announcement';
  isActive: boolean;
  priority: number;
  targetAudience?: string[];
  clicks: number;
  impressions: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  imageAlt: {
    type: String,
    required: [true, 'Image alt text is required'],
    trim: true,
    maxlength: [200, 'Alt text cannot exceed 200 characters']
  },
  mobileImageUrl: {
    type: String,
    trim: true
  },
  mobileImageAlt: {
    type: String,
    trim: true,
    maxlength: [200, 'Mobile alt text cannot exceed 200 characters']
  },
  linkUrl: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    enum: ['hero', 'sidebar', 'footer', 'popup', 'announcement'],
    required: [true, 'Position is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  targetAudience: [{
    type: String,
    trim: true
  }],
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  impressions: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
bannerSchema.index({ position: 1, isActive: 1 });
bannerSchema.index({ priority: -1 });
bannerSchema.index({ createdAt: -1 });

export default mongoose.model<IBanner>('Banner', bannerSchema);
