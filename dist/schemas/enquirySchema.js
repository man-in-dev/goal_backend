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