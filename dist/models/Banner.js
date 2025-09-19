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
const bannerSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Banner', bannerSchema);
//# sourceMappingURL=Banner.js.map