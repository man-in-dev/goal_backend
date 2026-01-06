import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmissionForm extends Document {
  // Basic Information
  name: string;
  phone: string;
  email: string;
  address: string;
  source: string;
  
  // Applicant Details
  applicationNo?: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  category: string;
  nationality: string;
  motherTongue?: string;
  alternateContact: string; // WhatsApp Contact No.
  pinCode?: string;
  passportPhoto?: string; // File URL
  
  // Parent/Guardian details
  fatherName: string;
  fatherMobile: string;
  fatherWhatsApp: string;
  fatherOccupation: string;
  motherName: string;
  motherMobile: string;
  motherOccupation: string;
  annualFamilyIncome: string;
  guardianName?: string;
  guardianMobile?: string;
  guardianWhatsApp?: string;
  guardianRelationship?: string;
  
  // Academic Records
  previousClass: string;
  previousSchool: string;
  previousBoard: string;
  previousYear: string;
  previousMarks: string;
  previousGrade?: string;
  classSeekingAdmission: string;
  
  // Test Preferences
  // preferredTestDate: string;
  preferredTestCentre: string;
  
  // Documents
  reportCard?: string; // File URL
  birthCertificate?: string; // File URL
  idProof?: string; // File URL
  
  // Declaration
  declarationAccepted: boolean;
  parentGuardianName: string;
  declarationDate: string;
  
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'admitted';
  createdAt: Date;
  updatedAt: Date;
}

const admissionFormSchema = new Schema<IAdmissionForm>({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  source: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, 'Source cannot exceed 50 characters'],
    default: 'online_admission_form'
  },
  
  // Applicant Details
  applicationNo: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, 'Application number cannot exceed 50 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    trim: true,
    enum: ['male', 'female', 'other'],
    maxlength: [20, 'Gender cannot exceed 20 characters']
  },
  dateOfBirth: {
    type: String,
    required: [true, 'Date of birth is required'],
    trim: true
  },
  placeOfBirth: {
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'Place of birth cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  nationality: {
    type: String,
    required: [true, 'Nationality is required'],
    trim: true,
    maxlength: [100, 'Nationality cannot exceed 100 characters']
  },
  motherTongue: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Mother tongue cannot exceed 100 characters']
  },
  alternateContact: {
    type: String,
    required: [true, 'WhatsApp contact number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  pinCode: {
    type: String,
    required: false,
    trim: true,
    maxlength: [10, 'Pin code cannot exceed 10 characters']
  },
  passportPhoto: {
    type: String,
    required: false,
    trim: true
  },
  
  // Parent/Guardian details
  fatherName: {
    type: String,
    required: [true, 'Father\'s name is required'],
    trim: true,
    maxlength: [100, 'Father\'s name cannot exceed 100 characters']
  },
  fatherMobile: {
    type: String,
    required: [true, 'Father\'s mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  fatherWhatsApp: {
    type: String,
    required: [true, 'Father\'s WhatsApp number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father\'s occupation is required'],
    trim: true,
    maxlength: [100, 'Father\'s occupation cannot exceed 100 characters']
  },
  motherName: {
    type: String,
    required: [true, 'Mother\'s name is required'],
    trim: true,
    maxlength: [100, 'Mother\'s name cannot exceed 100 characters']
  },
  motherMobile: {
    type: String,
    required: [true, 'Mother\'s mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother\'s occupation is required'],
    trim: true,
    maxlength: [100, 'Mother\'s occupation cannot exceed 100 characters']
  },
  annualFamilyIncome: {
    type: String,
    required: [true, 'Annual family income is required'],
    trim: true,
    maxlength: [50, 'Annual family income cannot exceed 50 characters']
  },
  guardianName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Guardian name cannot exceed 100 characters']
  },
  guardianMobile: {
    type: String,
    required: false,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  guardianWhatsApp: {
    type: String,
    required: false,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  guardianRelationship: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Guardian relationship cannot exceed 100 characters']
  },
  
  // Academic Records
  previousClass: {
    type: String,
    required: [true, 'Previous class is required'],
    trim: true,
    maxlength: [50, 'Previous class cannot exceed 50 characters']
  },
  previousSchool: {
    type: String,
    required: [true, 'Previous school name is required'],
    trim: true,
    maxlength: [200, 'Previous school name cannot exceed 200 characters']
  },
  previousBoard: {
    type: String,
    required: [true, 'Board is required'],
    trim: true,
    maxlength: [100, 'Board cannot exceed 100 characters']
  },
  previousYear: {
    type: String,
    required: [true, 'Year of passing is required'],
    trim: true,
    maxlength: [10, 'Year of passing cannot exceed 10 characters']
  },
  previousMarks: {
    type: String,
    required: [true, 'Percentage marks is required'],
    trim: true,
    maxlength: [10, 'Percentage marks cannot exceed 10 characters']
  },
  previousGrade: {
    type: String,
    required: false,
    trim: true,
    maxlength: [10, 'Previous grade cannot exceed 10 characters']
  },
  classSeekingAdmission: {
    type: String,
    required: [true, 'Class seeking admission is required'],
    trim: true,
    maxlength: [50, 'Class seeking admission cannot exceed 50 characters']
  },
  
  // Test Preferences
  // preferredTestDate: {
  //   type: String,
  //   required: [true, 'Preferred entrance test date is required'],
  //   trim: true
  // },
  preferredTestCentre: {
    type: String,
    required: [true, 'Preferred test centre is required'],
    trim: true,
    maxlength: [200, 'Preferred test centre cannot exceed 200 characters']
  },
  
  // Documents
  reportCard: {
    type: String,
    required: false,
    trim: true
  },
  birthCertificate: {
    type: String,
    required: false,
    trim: true
  },
  idProof: {
    type: String,
    required: false,
    trim: true
  },
  
  // Declaration
  declarationAccepted: {
    type: Boolean,
    required: [true, 'Declaration acceptance is required'],
    default: false
  },
  parentGuardianName: {
    type: String,
    required: [true, 'Parent/Guardian name is required'],
    trim: true,
    maxlength: [100, 'Parent/Guardian name cannot exceed 100 characters']
  },
  declarationDate: {
    type: String,
    required: [true, 'Declaration date is required'],
    trim: true
  },
  
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'admitted'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
admissionFormSchema.index({ email: 1 });
admissionFormSchema.index({ phone: 1 });
admissionFormSchema.index({ status: 1 });
admissionFormSchema.index({ createdAt: -1 });
admissionFormSchema.index({ classSeekingAdmission: 1 });

export default mongoose.model<IAdmissionForm>('AdmissionForm', admissionFormSchema);

