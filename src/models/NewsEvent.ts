import mongoose, { Document, Schema } from 'mongoose';

export interface INewsEvent extends Document {
  title: string;
  content: string;
  excerpt?: string;
  type: 'news' | 'event' | 'announcement' | 'achievement';
  category: 'academic' | 'sports' | 'cultural' | 'achievement' | 'general';
  featuredImage?: string;
  imageAlt?: string;
  author: string;
  isPublished: boolean;
  isFeatured: boolean;
  publishDate?: Date;
  publishTime?: string; // Time in HH:MM format (e.g., "10:00 AM")
  location?: string; // Location for events (e.g., "Online", "Main Campus", "Auditorium")
  expiryDate?: Date;
  tags: string[];
  views: number;
  likes: number;
  shares: number;
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const newsEventSchema = new Schema<INewsEvent>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['news', 'event', 'announcement', 'achievement'],
    required: [true, 'Type is required']
  },
  category: {
    type: String,
    enum: ['academic', 'sports', 'cultural', 'achievement', 'general'],
    required: [true, 'Category is required'],
    default: 'general'
  },
  featuredImage: {
    type: String,
    trim: true
  },
  imageAlt: {
    type: String,
    trim: true,
    maxlength: [200, 'Image alt text cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date
  },
  publishTime: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/i.test(v);
      },
      message: 'Please provide a valid time in HH:MM AM/PM format'
    }
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  expiryDate: {
    type: Date
  },
  tags: {
    type: [String],
    default: []
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Meta title cannot exceed 200 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [300, 'Meta description cannot exceed 300 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true
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
newsEventSchema.index({ type: 1 });
newsEventSchema.index({ publishDate: -1 });
newsEventSchema.index({ createdAt: -1 });

export default mongoose.model<INewsEvent>('NewsEvent', newsEventSchema);
