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
        required: false,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    studying: {
        type: String,
        required: [true, 'Current class/studying is required'],
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
        required: [true, 'State is required'],
        trim: true,
        maxlength: [50, 'State cannot exceed 50 characters']
    },
    district: {
        type: String,
        required: [true, 'District is required'],
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
    // Parent/Guardian details
    fatherName: {
        type: String,
        required: [true, 'Father\'s name is required'],
        trim: true,
        maxlength: [100, 'Father\'s name cannot exceed 100 characters']
    },
    fatherMobile: {
        type: String,
        required: [true, 'Father\'s mobile number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    fatherWhatsApp: {
        type: String,
        required: [true, 'Father\'s WhatsApp number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    fatherOccupation: {
        type: String,
        required: [true, 'Father\'s occupation is required'],
        trim: true,
        maxlength: [100, 'Father\'s occupation cannot exceed 100 characters']
    },
    motherName: {
        type: String,
        required: [true, 'Mother\'s name is required'],
        trim: true,
        maxlength: [100, 'Mother\'s name cannot exceed 100 characters']
    },
    motherMobile: {
        type: String,
        required: [true, 'Mother\'s mobile number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    motherOccupation: {
        type: String,
        required: [true, 'Mother\'s occupation is required'],
        trim: true,
        maxlength: [100, 'Mother\'s occupation cannot exceed 100 characters']
    },
    annualFamilyIncome: {
        type: String,
        required: [true, 'Annual family income is required'],
        trim: true,
        maxlength: [50, 'Annual family income cannot exceed 50 characters']
    },
    // Academic Records
    previousClass: {
        type: String,
        required: [true, 'Previous class is required'],
        trim: true,
        maxlength: [50, 'Previous class cannot exceed 50 characters']
    },
    previousSchool: {
        type: String,
        required: [true, 'Previous school name is required'],
        trim: true,
        maxlength: [200, 'Previous school name cannot exceed 200 characters']
    },
    previousBoard: {
        type: String,
        required: [true, 'Board is required'],
        trim: true,
        maxlength: [100, 'Board cannot exceed 100 characters']
    },
    previousYear: {
        type: String,
        required: [true, 'Year of passing is required'],
        trim: true,
        maxlength: [10, 'Year of passing cannot exceed 10 characters']
    },
    previousMarks: {
        type: String,
        required: [true, 'Percentage marks is required'],
        trim: true,
        maxlength: [10, 'Percentage marks cannot exceed 10 characters']
    },
    // Test Preferences
    preferredTestDate: {
        type: String,
        required: [true, 'Preferred entrance test date is required'],
        trim: true
    },
    preferredTestCentre: {
        type: String,
        required: [true, 'Preferred test centre is required'],
        trim: true,
        maxlength: [200, 'Preferred test centre cannot exceed 200 characters']
    },
    // Applicant Details
    applicationNo: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Application number cannot exceed 50 characters']
    },
    gender: {
        type: String,
        required: false,
        trim: true,
        enum: ['male', 'female', 'other'],
        maxlength: [20, 'Gender cannot exceed 20 characters']
    },
    dateOfBirth: {
        type: String,
        required: false,
        trim: true
    },
    placeOfBirth: {
        type: String,
        required: false,
        trim: true,
        maxlength: [200, 'Place of birth cannot exceed 200 characters']
    },
    category: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Category cannot exceed 50 characters']
    },
    nationality: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Nationality cannot exceed 100 characters']
    },
    motherTongue: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Mother tongue cannot exceed 100 characters']
    },
    alternateContact: {
        type: String,
        required: false,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    pinCode: {
        type: String,
        required: false,
        trim: true,
        maxlength: [10, 'Pin code cannot exceed 10 characters']
    },
    passportPhoto: {
        type: String,
        required: false,
        trim: true
    },
    // Guardian Details
    guardianName: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Guardian name cannot exceed 100 characters']
    },
    guardianMobile: {
        type: String,
        required: false,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    guardianWhatsApp: {
        type: String,
        required: false,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },
    guardianRelationship: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Guardian relationship cannot exceed 100 characters']
    },
    // Additional Academic Fields
    previousGrade: {
        type: String,
        required: false,
        trim: true,
        maxlength: [10, 'Previous grade cannot exceed 10 characters']
    },
    classSeekingAdmission: {
        type: String,
        required: false,
        trim: true,
        maxlength: [50, 'Class seeking admission cannot exceed 50 characters']
    },
    // Documents
    reportCard: {
        type: String,
        required: false,
        trim: true
    },
    birthCertificate: {
        type: String,
        required: false,
        trim: true
    },
    idProof: {
        type: String,
        required: false,
        trim: true
    },
    // Declaration
    declarationAccepted: {
        type: Boolean,
        required: false,
        default: false
    },
    parentGuardianName: {
        type: String,
        required: false,
        trim: true,
        maxlength: [100, 'Parent/Guardian name cannot exceed 100 characters']
    },
    declarationDate: {
        type: String,
        required: false,
        trim: true
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