import { z } from 'zod';

// Admission form validation schema
export const admissionFormSchema = z.object({
  // Basic Information
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
  
  address: z.string()
    .min(1, 'Address is required')
    .max(500, 'Address cannot exceed 500 characters')
    .trim(),
  
  source: z.string()
    .max(50, 'Source cannot exceed 50 characters')
    .trim()
    .optional()
    .default('online_admission_form'),
  
  // Applicant Details
  applicationNo: z.string()
    .max(50, 'Application number cannot exceed 50 characters')
    .trim()
    .optional(),

  gender: z.enum(['male', 'female', 'other']),

  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .trim(),

  placeOfBirth: z.string()
    .max(200, 'Place of birth cannot exceed 200 characters')
    .trim()
    .optional(),

  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category cannot exceed 50 characters')
    .trim(),

  nationality: z.string()
    .min(1, 'Nationality is required')
    .max(100, 'Nationality cannot exceed 100 characters')
    .trim(),

  motherTongue: z.string()
    .max(100, 'Mother tongue cannot exceed 100 characters')
    .trim()
    .optional(),

  alternateContact: z.string()
    .min(1, 'WhatsApp contact number is required')
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim(),

  pinCode: z.string()
    .max(10, 'Pin code cannot exceed 10 characters')
    .trim()
    .optional(),

  passportPhoto: z.string()
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

  guardianName: z.string()
    .max(100, 'Guardian name cannot exceed 100 characters')
    .trim()
    .optional(),

  guardianMobile: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim()
    .optional(),

  guardianWhatsApp: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim()
    .optional(),

  guardianRelationship: z.string()
    .max(100, 'Guardian relationship cannot exceed 100 characters')
    .trim()
    .optional(),

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

  previousGrade: z.string()
    .max(10, 'Previous grade cannot exceed 10 characters')
    .trim()
    .optional(),

  classSeekingAdmission: z.string()
    .min(1, 'Class seeking admission is required')
    .max(50, 'Class seeking admission cannot exceed 50 characters')
    .trim(),

  // Test Preferences
  preferredTestDate: z.string()
    .min(1, 'Preferred entrance test date is required')
    .trim(),

  preferredTestCentre: z.string()
    .min(1, 'Preferred test centre is required')
    .max(200, 'Preferred test centre cannot exceed 200 characters')
    .trim(),

  // Documents
  reportCard: z.string()
    .trim()
    .optional(),

  birthCertificate: z.string()
    .trim()
    .optional(),

  idProof: z.string()
    .trim()
    .optional(),

  // Declaration
  declarationAccepted: z.boolean()
    .refine((val) => val === true, {
      message: 'Declaration must be accepted'
    }),

  parentGuardianName: z.string()
    .min(1, 'Parent/Guardian name is required')
    .max(100, 'Parent/Guardian name cannot exceed 100 characters')
    .trim(),

  declarationDate: z.string()
    .min(1, 'Declaration date is required')
    .trim(),

  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'admitted'])
    .optional()
    .default('pending')
});

// Update admission form schema (for PUT requests)
export const updateAdmissionFormSchema = z.object({
  name: z.string()
    .max(100, 'Name cannot exceed 100 characters')
    .trim()
    .optional(),
  
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number')
    .trim()
    .optional(),
  
  email: z.string()
    .email('Please provide a valid email')
    .toLowerCase()
    .trim()
    .optional(),
  
  address: z.string()
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional(),
  
  status: z.enum(['pending', 'under_review', 'approved', 'rejected', 'admitted'])
    .optional()
});

// Type inference from schema
export type AdmissionFormInput = z.infer<typeof admissionFormSchema>;
export type UpdateAdmissionFormInput = z.infer<typeof updateAdmissionFormSchema>;

