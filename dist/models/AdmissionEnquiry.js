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
const admissionEnquirySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
    },
    course: {
        type: String,
        required: [true, 'Course selection is required'],
        enum: {
            values: ['medical', 'engineering', 'foundation', 'test-series'],
            message: 'Please select a valid course'
        }
    },
    studyLevel: {
        type: String,
        required: [true, 'Study level is required'],
        enum: {
            values: ['12th pass', '12th', '11th', '9th', '8th', '7th', '6th'],
            message: 'Please select a valid study level'
        }
    },
    address: {
        type: String,
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters']
    },
    message: {
        type: String,
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'enrolled', 'rejected'],
        default: 'pending'
    },
    source: {
        type: String,
        default: 'website',
        enum: ['website', 'phone', 'walk-in', 'referral']
    }
}, {
    timestamps: true
});
// Index for better query performance
admissionEnquirySchema.index({ email: 1, createdAt: -1 });
admissionEnquirySchema.index({ status: 1, createdAt: -1 });
admissionEnquirySchema.index({ course: 1, createdAt: -1 });
// Pre-save middleware to clean data
admissionEnquirySchema.pre('save', function (next) {
    // Clean phone number
    if (this.phone) {
        this.phone = this.phone.replace(/\s+/g, '').trim();
    }
    // Clean name
    if (this.name) {
        this.name = this.name.trim().replace(/\s+/g, ' ');
    }
    next();
});
exports.default = mongoose_1.default.model('AdmissionEnquiry', admissionEnquirySchema);
//# sourceMappingURL=AdmissionEnquiry.js.map