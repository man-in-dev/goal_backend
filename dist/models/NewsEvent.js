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
const newsEventSchema = new mongoose_1.Schema({
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
            validator: function (v) {
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
exports.default = mongoose_1.default.model('NewsEvent', newsEventSchema);
//# sourceMappingURL=NewsEvent.js.map