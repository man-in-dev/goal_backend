import { z } from 'zod';

// Enquiry form validation schema - Basic enquiry fields only
export const enquiryFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim(),
  
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  
  studying: z.string()
    .min(1, 'Current class/studying is required')
    .max(100, 'Studying field cannot exceed 100 characters')
    .trim(),
  
  studyLevel: z.string()
    .max(100, 'Study level cannot exceed 100 characters')
    .trim()
    .optional(),
  
  course: z.string()
    .min(1, 'Course is required')
    .max(100, 'Course cannot exceed 100 characters')
    .trim(),
  
  state: z.string()
    .min(1, 'State is required')
    .max(50, 'State cannot exceed 50 characters')
    .trim(),
  
  district: z.string()
    .min(1, 'District is required')
    .max(50, 'District cannot exceed 50 characters')
    .trim(),
  
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional(),
  
  query: z.string()
    .max(1000, 'Query cannot exceed 1000 characters')
    .trim()
    .optional(),
  
  message: z.string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim()
    .optional(),
  
  countryCode: z.string()
    .max(5, 'Country code cannot exceed 5 characters')
    .trim()
    .optional(),
  
  source: z.string()
    .max(50, 'Source cannot exceed 50 characters')
    .trim()
    .optional(),
  
  status: z.enum(['pending', 'contacted', 'resolved', 'closed'])
    .optional()
    .default('pending')
});

// Update enquiry schema (for PUT requests)
export const updateEnquirySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim()
    .optional(),
  
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  
  studying: z.string()
    .max(100, 'Studying field cannot exceed 100 characters')
    .trim()
    .optional(),
  
  studyLevel: z.string()
    .max(100, 'Study level cannot exceed 100 characters')
    .trim()
    .optional(),
  
  course: z.string()
    .min(1, 'Course is required')
    .max(100, 'Course cannot exceed 100 characters')
    .trim()
    .optional(),
  
  state: z.string()
    .min(1, 'State is required')
    .max(50, 'State cannot exceed 50 characters')
    .trim()
    .optional(),
  
  district: z.string()
    .min(1, 'District is required')
    .max(50, 'District cannot exceed 50 characters')
    .trim()
    .optional(),
  
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional(),
  
  query: z.string()
    .max(1000, 'Query cannot exceed 1000 characters')
    .trim()
    .optional(),
  
  message: z.string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .trim()
    .optional(),
  
  countryCode: z.string()
    .max(5, 'Country code cannot exceed 5 characters')
    .trim()
    .optional(),
  
  source: z.string()
    .max(50, 'Source cannot exceed 50 characters')
    .trim()
    .optional(),
  
  status: z.enum(['pending', 'contacted', 'resolved', 'closed'])
    .optional()
});

// Type inference from schema
export type EnquiryFormInput = z.infer<typeof enquiryFormSchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;

