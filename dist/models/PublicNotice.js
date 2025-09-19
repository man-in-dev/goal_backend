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
const publicNoticeSchema = new mongoose_1.Schema({
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
            validator: function (v) {
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
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('PublicNotice', publicNoticeSchema);
//# sourceMappingURL=PublicNotice.js.map