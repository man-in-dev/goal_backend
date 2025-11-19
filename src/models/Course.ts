import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  category: 'Medical Courses' | 'Engineering Courses' | 'Pre-Foundation Course';
  icon?: string; // Icon name or identifier
  order: number; // For sorting/display order
  isActive: boolean;
  slug: string; // URL-friendly identifier
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },
  category: {
    type: String,
    enum: ['Medical Courses', 'Engineering Courses', 'Pre-Foundation Course'],
    required: [true, 'Category is required'],
  },
  icon: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    required: [true, 'Order is required'],
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
CourseSchema.index({ category: 1, order: 1 });
CourseSchema.index({ slug: 1 });
CourseSchema.index({ isActive: 1 });

// Generate slug from title before saving
CourseSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

const Course = mongoose.model<ICourse>('Course', CourseSchema);

export default Course;

