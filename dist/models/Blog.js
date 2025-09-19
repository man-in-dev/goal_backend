"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const blogSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Blog', blogSchema);
//# sourceMappingURL=Blog.js.map