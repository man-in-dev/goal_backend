"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquirySchema = exports.enquiryFormSchema = void 0;
const zod_1 = require("zod");
// Enquiry form validation schema
exports.enquiryFormSchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    phone: zod_1.z.string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim(),
    email: zod_1.z.string()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase()
        .trim(),
    studying: zod_1.z.string()
        .min(1, 'Current class/studying is required')
        .max(100, 'Studying field cannot exceed 100 characters')
        .trim(),
    studyLevel: zod_1.z.string()
        .max(100, 'Study level cannot exceed 100 characters')
        .trim()
        .optional(),
    course: zod_1.z.string()
        .min(1, 'Course is required')
        .max(100, 'Course cannot exceed 100 characters')
        .trim(),
    state: zod_1.z.string()
        .min(1, 'State is required')
        .max(50, 'State cannot exceed 50 characters')
        .trim(),
    district: zod_1.z.string()
        .min(1, 'District is required')
        .max(50, 'District cannot exceed 50 characters')
        .trim(),
    address: zod_1.z.string()
        .min(1, 'Address is required')
        .max(500, 'Address cannot exceed 500 characters')
        .trim(),
    query: zod_1.z.string()
        .max(1000, 'Query cannot exceed 1000 characters')
        .trim()
        .optional(),
    message: zod_1.z.string()
        .max(1000, 'Message cannot exceed 1000 characters')
        .trim()
        .optional(),
    countryCode: zod_1.z.string()
        .max(5, 'Country code cannot exceed 5 characters')
        .trim()
        .optional(),
    source: zod_1.z.string()
        .max(50, 'Source cannot exceed 50 characters')
        .trim()
        .optional(),
    // Parent/Guardian details
    fatherName: zod_1.z.string()
        .min(1, 'Father\'s name is required')
        .max(100, 'Father\'s name cannot exceed 100 characters')
        .trim(),
    fatherMobile: zod_1.z.string()
        .min(1, 'Father\'s mobile number is required')
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim(),
    fatherWhatsApp: zod_1.z.string()
        .min(1, 'Father\'s WhatsApp number is required')
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim(),
    fatherOccupation: zod_1.z.string()
        .min(1, 'Father\'s occupation is required')
        .max(100, 'Father\'s occupation cannot exceed 100 characters')
        .trim(),
    motherName: zod_1.z.string()
        .min(1, 'Mother\'s name is required')
        .max(100, 'Mother\'s name cannot exceed 100 characters')
        .trim(),
    motherMobile: zod_1.z.string()
        .min(1, 'Mother\'s mobile number is required')
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim(),
    motherOccupation: zod_1.z.string()
        .min(1, 'Mother\'s occupation is required')
        .max(100, 'Mother\'s occupation cannot exceed 100 characters')
        .trim(),
    annualFamilyIncome: zod_1.z.string()
        .min(1, 'Annual family income is required')
        .max(50, 'Annual family income cannot exceed 50 characters')
        .trim(),
    // Academic Records
    previousClass: zod_1.z.string()
        .min(1, 'Previous class is required')
        .max(50, 'Previous class cannot exceed 50 characters')
        .trim(),
    previousSchool: zod_1.z.string()
        .min(1, 'Previous school name is required')
        .max(200, 'Previous school name cannot exceed 200 characters')
        .trim(),
    previousBoard: zod_1.z.string()
        .min(1, 'Board is required')
        .max(100, 'Board cannot exceed 100 characters')
        .trim(),
    previousYear: zod_1.z.string()
        .min(1, 'Year of passing is required')
        .max(10, 'Year of passing cannot exceed 10 characters')
        .trim(),
    previousMarks: zod_1.z.string()
        .min(1, 'Percentage marks is required')
        .max(10, 'Percentage marks cannot exceed 10 characters')
        .trim(),
    // Test Preferences
    preferredTestDate: zod_1.z.string()
        .min(1, 'Preferred entrance test date is required')
        .trim(),
    preferredTestCentre: zod_1.z.string()
        .min(1, 'Preferred test centre is required')
        .max(200, 'Preferred test centre cannot exceed 200 characters')
        .trim(),
    // Applicant Details
    applicationNo: zod_1.z.string()
        .max(50, 'Application number cannot exceed 50 characters')
        .trim()
        .optional(),
    gender: zod_1.z.enum(['male', 'female', 'other'])
        .optional(),
    dateOfBirth: zod_1.z.string()
        .trim()
        .optional(),
    placeOfBirth: zod_1.z.string()
        .max(200, 'Place of birth cannot exceed 200 characters')
        .trim()
        .optional(),
    category: zod_1.z.string()
        .max(50, 'Category cannot exceed 50 characters')
        .trim()
        .optional(),
    nationality: zod_1.z.string()
        .max(100, 'Nationality cannot exceed 100 characters')
        .trim()
        .optional(),
    motherTongue: zod_1.z.string()
        .max(100, 'Mother tongue cannot exceed 100 characters')
        .trim()
        .optional(),
    alternateContact: zod_1.z.string()
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim()
        .optional(),
    pinCode: zod_1.z.string()
        .max(10, 'Pin code cannot exceed 10 characters')
        .trim()
        .optional(),
    passportPhoto: zod_1.z.string()
        .trim()
        .optional(),
    // Guardian Details
    guardianName: zod_1.z.string()
        .max(100, 'Guardian name cannot exceed 100 characters')
        .trim()
        .optional(),
    guardianMobile: zod_1.z.string()
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim()
        .optional(),
    guardianWhatsApp: zod_1.z.string()
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim()
        .optional(),
    guardianRelationship: zod_1.z.string()
        .max(100, 'Guardian relationship cannot exceed 100 characters')
        .trim()
        .optional(),
    // Additional Academic Fields
    previousGrade: zod_1.z.string()
        .max(10, 'Previous grade cannot exceed 10 characters')
        .trim()
        .optional(),
    classSeekingAdmission: zod_1.z.string()
        .max(50, 'Class seeking admission cannot exceed 50 characters')
        .trim()
        .optional(),
    // Documents
    reportCard: zod_1.z.string()
        .trim()
        .optional(),
    birthCertificate: zod_1.z.string()
        .trim()
        .optional(),
    idProof: zod_1.z.string()
        .trim()
        .optional(),
    // Declaration
    declarationAccepted: zod_1.z.boolean()
        .optional()
        .default(false),
    parentGuardianName: zod_1.z.string()
        .max(100, 'Parent/Guardian name cannot exceed 100 characters')
        .trim()
        .optional(),
    declarationDate: zod_1.z.string()
        .trim()
        .optional(),
    status: zod_1.z.enum(['pending', 'contacted', 'resolved', 'closed'])
        .optional()
        .default('pending')
});
// Update enquiry schema (for PUT requests)
exports.updateEnquirySchema = zod_1.z.object({
    name: zod_1.z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim()
        .optional(),
    phone: zod_1.z.string()
        .min(1, 'Phone number is required')
        .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
        .trim()
        .optional(),
    email: zod_1.z.string()
        .min(1, 'Email is required')
        .email('Please provide a valid email')
        .toLowerCase()
        .trim()
        .optional(),
    studying: zod_1.z.string()
        .max(100, 'Studying field cannot exceed 100 characters')
        .trim()
        .optional(),
    studyLevel: zod_1.z.string()
        .max(100, 'Study level cannot exceed 100 characters')
        .trim()
        .optional(),
    course: zod_1.z.string()
        .min(1, 'Course is required')
        .max(100, 'Course cannot exceed 100 characters')
        .trim()
        .optional(),
    state: zod_1.z.string()
        .min(1, 'State is required')
        .max(50, 'State cannot exceed 50 characters')
        .trim()
        .optional(),
    district: zod_1.z.string()
        .min(1, 'District is required')
        .max(50, 'District cannot exceed 50 characters')
        .trim()
        .optional(),
    address: zod_1.z.string()
        .max(500, 'Address cannot exceed 500 characters')
        .trim()
        .optional(),
    query: zod_1.z.string()
        .max(1000, 'Query cannot exceed 1000 characters')
        .trim()
        .optional(),
    message: zod_1.z.string()
        .max(1000, 'Message cannot exceed 1000 characters')
        .trim()
        .optional(),
    countryCode: zod_1.z.string()
        .max(5, 'Country code cannot exceed 5 characters')
        .trim()
        .optional(),
    source: zod_1.z.string()
        .max(50, 'Source cannot exceed 50 characters')
        .trim()
        .optional(),
    status: zod_1.z.enum(['pending', 'contacted', 'resolved', 'closed'])
        .optional()
});
//# sourceMappingURL=enquirySchema.js.map