import { z } from 'zod';

// NEET Counselling form validation schema
export const neetCounsellingFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  
  mobileNo: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number')
    .trim(),
  
  whatsappNo: z.string()
    .min(1, 'WhatsApp number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit WhatsApp number')
    .trim(),
  
  homeTown: z.string()
    .min(1, 'Home town is required')
    .max(100, 'Home town cannot exceed 100 characters')
    .trim(),
  
  previousSchoolOrCoaching: z.string()
    .min(1, 'Previous school/coaching name is required')
    .max(200, 'Previous school/coaching name cannot exceed 200 characters')
    .trim(),
  
  category: z.string()
    .optional()
    .default('Government Medical Colleges')
});

// Update NEET counselling schema (for PUT requests)
export const updateNEETCounsellingSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  
  mobileNo: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number')
    .trim()
    .optional(),
  
  whatsappNo: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit WhatsApp number')
    .trim()
    .optional(),
  
  homeTown: z.string()
    .max(100, 'Home town cannot exceed 100 characters')
    .trim()
    .optional(),
  
  previousSchoolOrCoaching: z.string()
    .max(200, 'Previous school/coaching name cannot exceed 200 characters')
    .trim()
    .optional(),
  
  category: z.string().optional(),
  
  status: z.string()
    .refine(
      (val) => ['pending', 'contacted', 'processed', 'closed'].includes(val),
      'Please select a valid status'
    )
    .optional(),
  
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .trim()
    .optional()
});
