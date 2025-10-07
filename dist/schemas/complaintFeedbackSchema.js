"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintFeedbackSchema = exports.complaintFeedbackSchema = void 0;
const zod_1 = require("zod");
// Complaint/Feedback form validation schema
exports.complaintFeedbackSchema = zod_1.z.object({
    isGoalStudent: zod_1.z.boolean(),
    uid: zod_1.z.string()
        .max(50, 'UID cannot exceed 50 characters')
        .trim()
        .optional(),
    rollNo: zod_1.z.string()
        .max(20, 'Roll number cannot exceed 20 characters')
        .trim()
        .optional(),
    name: zod_1.z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim(),
    course: zod_1.z.string()
        .min(1, 'Course is required')
        .max(100, 'Course cannot exceed 100 characters')
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
    type: zod_1.z.enum(['complaint', 'feedback', 'suggestion']),
    department: zod_1.z.string()
        .min(1, 'Department is required')
        .max(100, 'Department cannot exceed 100 characters')
        .trim(),
    message: zod_1.z.string()
        .min(1, 'Message is required')
        .max(2000, 'Message cannot exceed 2000 characters')
        .trim(),
    attachment: zod_1.z.string()
        .trim()
        .optional(),
    attachmentAlt: zod_1.z.string()
        .max(200, 'Attachment alt text cannot exceed 200 characters')
        .trim()
        .optional(),
    status: zod_1.z.enum(['pending', 'in_review', 'resolved', 'closed'])
        .optional()
        .default('pending')
}).superRefine((data, ctx) => {
    // UID is required if isGoalStudent is true
    if (data.isGoalStudent && (!data.uid || data.uid.trim() === '')) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'UID is required for Goal students',
            path: ['uid']
        });
    }
    // Roll number is required if isGoalStudent is true
    if (data.isGoalStudent && (!data.rollNo || data.rollNo.trim() === '')) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            message: 'Roll number is required for Goal students',
            path: ['rollNo']
        });
    }
});
// Update complaint/feedback schema (for PUT requests)
exports.updateComplaintFeedbackSchema = zod_1.z.object({
    isGoalStudent: zod_1.z.boolean().optional(),
    uid: zod_1.z.string()
        .max(50, 'UID cannot exceed 50 characters')
        .trim()
        .optional(),
    rollNo: zod_1.z.string()
        .max(20, 'Roll number cannot exceed 20 characters')
        .trim()
        .optional(),
    name: zod_1.z.string()
        .min(1, 'Name is required')
        .max(100, 'Name cannot exceed 100 characters')
        .trim()
        .optional(),
    course: zod_1.z.string()
        .min(1, 'Course is required')
        .max(100, 'Course cannot exceed 100 characters')
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
    type: zod_1.z.enum(['complaint', 'feedback', 'suggestion']).optional(),
    department: zod_1.z.string()
        .min(1, 'Department is required')
        .max(100, 'Department cannot exceed 100 characters')
        .trim()
        .optional(),
    message: zod_1.z.string()
        .min(1, 'Message is required')
        .max(2000, 'Message cannot exceed 2000 characters')
        .trim()
        .optional(),
    attachment: zod_1.z.string()
        .trim()
        .optional(),
    attachmentAlt: zod_1.z.string()
        .max(200, 'Attachment alt text cannot exceed 200 characters')
        .trim()
        .optional(),
    status: zod_1.z.enum(['pending', 'in_review', 'resolved', 'closed'])
        .optional()
});
//# sourceMappingURL=complaintFeedbackSchema.js.map