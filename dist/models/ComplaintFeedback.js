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
const complaintFeedbackSchema = new mongoose_1.Schema({
    isGoalStudent: {
        type: Boolean,
        required: [true, 'Student type is required'],
        default: false
    },
    uid: {
        type: String,
        required: function () {
            return this.isGoalStudent;
        },
        trim: true,
        maxlength: [50, 'UID cannot exceed 50 characters']
    },
    rollNo: {
        type: String,
        required: function () {
            return this.isGoalStudent;
        },
        trim: true,
        maxlength: [20, 'Roll number cannot exceed 20 characters']
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    course: {
        type: String,
        required: function () {
            return this.isGoalStudent;
        },
        trim: true,
        maxlength: [100, 'Course cannot exceed 100 characters']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    type: {
        type: String,
        enum: ['complaint', 'feedback', 'suggestion'],
        required: [true, 'Type is required']
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        maxlength: [100, 'Department cannot exceed 100 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    attachment: {
        type: String,
        trim: true
    },
    attachmentAlt: {
        type: String,
        trim: true,
        maxlength: [200, 'Attachment alt text cannot exceed 200 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'in_review', 'resolved', 'closed'],
        default: 'pending'
    }
}, {
    timestamps: true
});
// Index for better query performance
complaintFeedbackSchema.index({ email: 1 });
complaintFeedbackSchema.index({ status: 1 });
complaintFeedbackSchema.index({ type: 1 });
complaintFeedbackSchema.index({ uid: 1 });
complaintFeedbackSchema.index({ rollNo: 1 });
complaintFeedbackSchema.index({ department: 1 });
complaintFeedbackSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model('ComplaintFeedback', complaintFeedbackSchema);
//# sourceMappingURL=ComplaintFeedback.js.map