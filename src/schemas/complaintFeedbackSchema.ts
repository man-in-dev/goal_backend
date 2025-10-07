import { z } from 'zod';

// Complaint/Feedback form validation schema
export const complaintFeedbackSchema = z.object({
  isGoalStudent: z.boolean(),
  
  uid: z.string()
    .max(50, 'UID cannot exceed 50 characters')
    .trim()
    .optional(),
  
  rollNo: z.string()
    .max(20, 'Roll number cannot exceed 20 characters')
    .trim()
    .optional(),
  
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  
  course: z.string()
    .min(1, 'Course is required')
    .max(100, 'Course cannot exceed 100 characters')
    .trim(),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim(),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please provide a valid email')
    .toLowerCase()
    .trim(),
  
  type: z.enum(['complaint', 'feedback', 'suggestion']),
  
  department: z.string()
    .min(1, 'Department is required')
    .max(100, 'Department cannot exceed 100 characters')
    .trim(),
  
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim(),
  
  attachment: z.string()
    .trim()
    .optional(),
  
  attachmentAlt: z.string()
    .max(200, 'Attachment alt text cannot exceed 200 characters')
    .trim()
    .optional(),
  
  status: z.enum(['pending', 'in_review', 'resolved', 'closed'])
    .optional()
    .default('pending')
}).superRefine((data, ctx) => {
  // UID is required if isGoalStudent is true
  if (data.isGoalStudent && (!data.uid || data.uid.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'UID is required for Goal students',
      path: ['uid']
    });
  }
  
  // Roll number is required if isGoalStudent is true
  if (data.isGoalStudent && (!data.rollNo || data.rollNo.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Roll number is required for Goal students',
      path: ['rollNo']
    });
  }
});

// Update complaint/feedback schema (for PUT requests)
export const updateComplaintFeedbackSchema = z.object({
  isGoalStudent: z.boolean().optional(),
  
  uid: z.string()
    .max(50, 'UID cannot exceed 50 characters')
    .trim()
    .optional(),
  
  rollNo: z.string()
    .max(20, 'Roll number cannot exceed 20 characters')
    .trim()
    .optional(),
  
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  
  course: z.string()
    .min(1, 'Course is required')
    .max(100, 'Course cannot exceed 100 characters')
    .trim()
    .optional(),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim()
    .optional(),
  
  email: z.string()
    .min(1, 'Email is required')
    .email('Please provide a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  
  type: z.enum(['complaint', 'feedback', 'suggestion']).optional(),
  
  department: z.string()
    .min(1, 'Department is required')
    .max(100, 'Department cannot exceed 100 characters')
    .trim()
    .optional(),
  
  message: z.string()
    .min(1, 'Message is required')
    .max(2000, 'Message cannot exceed 2000 characters')
    .trim()
    .optional(),
  
  attachment: z.string()
    .trim()
    .optional(),
  
  attachmentAlt: z.string()
    .max(200, 'Attachment alt text cannot exceed 200 characters')
    .trim()
    .optional(),
  
  status: z.enum(['pending', 'in_review', 'resolved', 'closed'])
    .optional()
});

// Type inference from schema
export type ComplaintFeedbackInput = z.infer<typeof complaintFeedbackSchema>;
export type UpdateComplaintFeedbackInput = z.infer<typeof updateComplaintFeedbackSchema>;
