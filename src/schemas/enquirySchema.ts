import { z } from 'zod';

// Enquiry form validation schema
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
    .min(1, 'Email is required')
    .email('Please provide a valid email')
    .toLowerCase()
    .trim(),
  
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
    .min(1, 'Address is required')
    .max(500, 'Address cannot exceed 500 characters')
    .trim(),
  
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
  
  // Parent/Guardian details
  fatherName: z.string()
    .min(1, 'Father\'s name is required')
    .max(100, 'Father\'s name cannot exceed 100 characters')
    .trim(),
  
  fatherMobile: z.string()
    .min(1, 'Father\'s mobile number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim(),
  
  fatherWhatsApp: z.string()
    .min(1, 'Father\'s WhatsApp number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim(),
  
  fatherOccupation: z.string()
    .min(1, 'Father\'s occupation is required')
    .max(100, 'Father\'s occupation cannot exceed 100 characters')
    .trim(),
  
  motherName: z.string()
    .min(1, 'Mother\'s name is required')
    .max(100, 'Mother\'s name cannot exceed 100 characters')
    .trim(),
  
  motherMobile: z.string()
    .min(1, 'Mother\'s mobile number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim(),
  
  motherOccupation: z.string()
    .min(1, 'Mother\'s occupation is required')
    .max(100, 'Mother\'s occupation cannot exceed 100 characters')
    .trim(),
  
  annualFamilyIncome: z.string()
    .min(1, 'Annual family income is required')
    .max(50, 'Annual family income cannot exceed 50 characters')
    .trim(),
  
  // Academic Records
  previousClass: z.string()
    .min(1, 'Previous class is required')
    .max(50, 'Previous class cannot exceed 50 characters')
    .trim(),
  
  previousSchool: z.string()
    .min(1, 'Previous school name is required')
    .max(200, 'Previous school name cannot exceed 200 characters')
    .trim(),
  
  previousBoard: z.string()
    .min(1, 'Board is required')
    .max(100, 'Board cannot exceed 100 characters')
    .trim(),
  
  previousYear: z.string()
    .min(1, 'Year of passing is required')
    .max(10, 'Year of passing cannot exceed 10 characters')
    .trim(),
  
  previousMarks: z.string()
    .min(1, 'Percentage marks is required')
    .max(10, 'Percentage marks cannot exceed 10 characters')
    .trim(),
  
  // Test Preferences
  preferredTestDate: z.string()
    .min(1, 'Preferred entrance test date is required')
    .trim(),
  
  preferredTestCentre: z.string()
    .min(1, 'Preferred test centre is required')
    .max(200, 'Preferred test centre cannot exceed 200 characters')
    .trim(),
  
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
    .min(1, 'Email is required')
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
