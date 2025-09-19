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
const gaetFormSchema = new mongoose_1.Schema({
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
    fatherName: {
        type: String,
        required: [true, 'Father name is required'],
        trim: true,
        maxlength: [100, 'Father name cannot exceed 100 characters']
    },
    motherName: {
        type: String,
        required: [true, 'Mother name is required'],
        trim: true,
        maxlength: [100, 'Mother name cannot exceed 100 characters']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['male', 'female', 'other']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [500, 'Address cannot exceed 500 characters']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
        match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
    },
    schoolName: {
        type: String,
        required: [true, 'School name is required'],
        trim: true,
        maxlength: [200, 'School name cannot exceed 200 characters']
    },
    currentClass: {
        type: String,
        required: [true, 'Current class is required'],
        enum: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
    },
    examCenter: {
        type: String,
        required: [true, 'Exam center is required'],
        trim: true
    },
    examDate: {
        type: Date,
        required: [true, 'Exam date is required']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        enum: ['online', 'offline', 'cash']
    },
    agreeToTerms: {
        type: Boolean,
        required: [true, 'You must agree to the terms and conditions'],
        validate: {
            validator: function (value) {
                return value === true;
            },
            message: 'You must agree to the terms and conditions'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'approved', 'rejected'],
        default: 'pending'
    },
    registrationNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    source: {
        type: String,
        default: 'website',
        enum: ['website', 'offline', 'phone']
    }
}, {
    timestamps: true
});
// Index for better query performance
gaetFormSchema.index({ email: 1, createdAt: -1 });
gaetFormSchema.index({ phone: 1, createdAt: -1 });
gaetFormSchema.index({ status: 1, createdAt: -1 });
// Note: registrationNumber index is automatically created by unique: true in field definition
// Pre-save middleware to clean data and generate registration number
gaetFormSchema.pre('save', function (next) {
    // Clean phone number
    if (this.phone) {
        this.phone = this.phone.replace(/\s+/g, '').trim();
    }
    // Clean names
    if (this.name) {
        this.name = this.name.trim().replace(/\s+/g, ' ');
    }
    if (this.fatherName) {
        this.fatherName = this.fatherName.trim().replace(/\s+/g, ' ');
    }
    if (this.motherName) {
        this.motherName = this.motherName.trim().replace(/\s+/g, ' ');
    }
    // Generate registration number if not exists
    if (!this.registrationNumber && this.isNew) {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.registrationNumber = `GAET${year}${randomNum}`;
    }
    next();
});
exports.default = mongoose_1.default.model('GAETForm', gaetFormSchema);
//# sourceMappingURL=GAETForm.js.map