import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  imageAlt?: string;
  author: string;
  category: 'education' | 'career' | 'technology' | 'lifestyle' | 'general';
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  publishDate?: Date;
  lastModified?: Date;
  views: number;
  likes: number;
  comments: number;
  readingTime: number; // in minutes
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  seoKeywords?: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
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
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  category: {
    type: String,
    enum: ['education', 'career', 'technology', 'lifestyle', 'general'],
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
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
  lastModified: {
    type: Date
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  comments: {
    type: Number,
    default: 0,
    min: 0
  },
  readingTime: {
    type: Number,
    default: 0,
    min: 0
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  seoKeywords: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: String,
    required: [true, 'Created by is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
// Note: slug index is automatically created by unique: true in field definition
blogSchema.index({ category: 1 });
blogSchema.index({ isPublished: 1, isFeatured: 1 });
blogSchema.index({ publishDate: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ tags: 1 });

// Pre-save middleware to generate slug and calculate reading time
// blogSchema.pre('save', async function(next) {
//   // Generate slug if missing or if title has changed
//   if ((this.isModified('title') || !this.slug) && this.title) {
//     let baseSlug = slugify(this.title, {
//       lower: true,        // Convert to lowercase
//       strict: true,       // Remove special characters
//       trim: true          // Trim whitespace
//     });
    
//     // Ensure slug is not empty
//     if (!baseSlug) {
//       baseSlug = 'blog-post';
//     }
    
//     // Ensure slug uniqueness
//     let finalSlug = baseSlug;
//     let counter = 1;
//     const BlogModel = this.constructor as mongoose.Model<IBlog>;
    
//     while (true) {
//       const existingBlog = await BlogModel.findOne({ 
//         slug: finalSlug, 
//         _id: { $ne: this._id } 
//       });
      
//       if (!existingBlog) {
//         break;
//       }
      
//       finalSlug = `${baseSlug}-${counter}`;
//       counter++;
//     }
    
//     this.slug = finalSlug;
//   }
  
//   // Set publish date if publishing and no publish date set
//   if (this.isModified('isPublished') && this.isPublished && !this.publishDate) {
//     this.publishDate = new Date();
//   }
  
//   // Calculate reading time when content changes
//   if (this.isModified('content') && this.content) {
//     // Remove HTML tags for accurate word count
//     const textContent = this.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
//     const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
//     this.readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Minimum 1 minute
//     this.lastModified = new Date();
//   }
  
//   next();
// });

export default mongoose.model<IBlog>('Blog', blogSchema);
