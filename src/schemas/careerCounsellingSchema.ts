import { z } from 'zod';

// Career Counselling form validation schema
export const careerCounsellingFormSchema = z.object({
  studentName: z.string()
    .min(1, 'Student name is required')
    .max(100, 'Student name cannot exceed 100 characters')
    .trim(),
  
  mobileNo: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number')
    .trim(),
  
  class: z.string()
    .min(1, 'Class is required')
    .max(50, 'Class cannot exceed 50 characters')
    .trim(),
  
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City cannot exceed 50 characters')
    .trim(),
  
  institute: z.string()
    .min(1, 'Institute name is required')
    .max(200, 'Institute name cannot exceed 200 characters')
    .trim(),
  
  examPreparation: z.string()
    .min(1, 'Exam preparation choice is required')
    .refine(
      (val) => ['NEET', 'JEE', 'NEET & JEE', 'Other'].includes(val),
      'Please select a valid exam preparation option'
    ),
  
  source: z.string()
    .max(50, 'Source cannot exceed 50 characters')
    .trim()
    .optional()
    .default('website')
});

// Update career counselling schema (for PUT requests)
export const updateCareerCounsellingSchema = z.object({
  studentName: z.string()
    .min(1, 'Student name is required')
    .max(100, 'Student name cannot exceed 100 characters')
    .trim()
    .optional(),
  
  mobileNo: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number')
    .trim()
    .optional(),
  
  class: z.string()
    .max(50, 'Class cannot exceed 50 characters')
    .trim()
    .optional(),
  
  city: z.string()
    .max(50, 'City cannot exceed 50 characters')
    .trim()
    .optional(),
  
  institute: z.string()
    .max(200, 'Institute name cannot exceed 200 characters')
    .trim()
    .optional(),
  
  examPreparation: z.string()
    .refine(
      (val) => ['NEET', 'JEE', 'NEET & JEE', 'Other'].includes(val),
      'Please select a valid exam preparation option'
    )
    .optional(),
  
  status: z.enum(['pending', 'contacted', 'counselled', 'closed'])
    .optional(),
  
  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .trim()
    .optional()
});
