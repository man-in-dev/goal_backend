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
const enquiryFormSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
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
    studying: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Studying field cannot exceed 100 characters']
    },
    studyLevel: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Study level cannot exceed 100 characters']
    },
    course: {
        type: String,
        required: [true, 'Course is required'],
        trim: true,
        maxlength: [100, 'Course cannot exceed 100 characters']
    },
    state: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'State cannot exceed 50 characters']
    },
    district: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'District cannot exceed 50 characters']
    },
    address: {
        type: String,
        required: false,
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters']
    },
    query: {
        type: String,
        required: false,
        trim: true,
        maxlength: [1000, 'Query cannot exceed 1000 characters']
    },
    message: {
        type: String,
        required: false,
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    countryCode: {
        type: String,
        required: false,
        trim: true,
        maxlength: [5, 'Country code cannot exceed 5 characters']
    },
    source: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Source cannot exceed 50 characters'],
        default: 'website'
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'resolved', 'closed'],
        default: 'pending'
    }
}, {
    timestamps: true
});
// Index for better query performance
enquiryFormSchema.index({ email: 1 });
enquiryFormSchema.index({ status: 1 });
enquiryFormSchema.index({ createdAt: -1 });
exports.default = mongoose_1.default.model('EnquiryForm', enquiryFormSchema);
//# sourceMappingURL=EnquiryForm.js.map