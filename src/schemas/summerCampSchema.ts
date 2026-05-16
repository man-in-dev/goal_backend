import { z } from 'zod';

export const summerCampSchema = z.object({
  studentName: z.string().min(1, 'Student name is required').trim(),
  fatherName: z.string().min(1, 'Father name is required').trim(),
  fatherOccupation: z.string().optional(),
  dob: z.string().min(1, 'Date of birth is required'),
  category: z.string().min(1, 'Category is required'),
  gender: z.string().min(1, 'Gender is required'),
  address: z.string().min(1, 'Address is required').trim(),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  postOffice: z.string().optional(),
  pinCode: z.string().min(6, 'Pin code must be 6 digits').max(6),
  studentMobile: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number'),
  studentWhatsApp: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number').optional().or(z.literal('')),
  parentMobile: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number'),
  parentWhatsApp: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number').optional().or(z.literal('')),
  currentClass: z.string().min(1, 'Current class is required'),
  schoolName: z.string().min(1, 'School name is required').trim(),
  schoolAddress: z.string().optional(),
  examCenter: z.string().min(1, 'Exam center is required'),
  photograph: z.string().optional(),
  rollNumber: z.string().optional(),
  status: z.enum(['pending', 'contacted', 'resolved', 'rejected']).optional().default('pending'),
});

export type SummerCampInput = z.infer<typeof summerCampSchema>;
