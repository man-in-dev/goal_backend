import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiryForm extends Document {
  // Basic Information
  name: string;
  phone: string;
  email?: string;
  studying?: string; // Optional for backward compatibility
  studyLevel?: string; // Alternative field name
  course: string;
  state: string; // Required field
  district: string; // Required field
  address?: string; // Optional for simple forms
  query?: string; // Optional for simple forms
  message?: string; // Alternative field name
  countryCode?: string; // Optional for simple forms
  source?: string; // Track where enquiry came from
  
  // Applicant Details
  applicationNo?: string;
  gender?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  category?: string;
  nationality?: string;
  motherTongue?: string;
  alternateContact?: string; // WhatsApp Contact No.
  pinCode?: string;
  passportPhoto?: string; // File URL
  
  // Parent/Guardian details
  fatherName?: string;
  fatherMobile?: string;
  fatherWhatsApp?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherMobile?: string;
  motherOccupation?: string;
  annualFamilyIncome?: string;
  guardianName?: string;
  guardianMobile?: string;
  guardianWhatsApp?: string;
  guardianRelationship?: string;
  
  // Academic Records
  previousClass?: string;
  previousSchool?: string;
  previousBoard?: string;
  previousYear?: string;
  previousMarks?: string;
  previousGrade?: string;
  classSeekingAdmission?: string;
  
  // Test Preferences
  preferredTestDate?: string;
  preferredTestCentre?: string;
  
  // Documents
  reportCard?: string; // File URL
  birthCertificate?: string; // File URL
  idProof?: string; // File URL
  
  // Declaration
  declarationAccepted?: boolean;
  parentGuardianName?: string;
  declarationDate?: string;
  
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const enquiryFormSchema = new Schema<IEnquiryForm>({
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
    required: false,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  studying: {
    type: String,
    required: [true, 'Current class/studying is required'],
    trim: true,
    maxlength: [100, 'Studying field cannot exceed 100 characters']
  },
  studyLevel: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Study level cannot exceed 100 characters']
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    maxlength: [100, 'Course cannot exceed 100 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [50, 'State cannot exceed 50 characters']
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
    maxlength: [50, 'District cannot exceed 50 characters']
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  query: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Query cannot exceed 1000 characters']
  },
  message: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  countryCode: {
    type: String,
    required: false,
    trim: true,
    maxlength: [5, 'Country code cannot exceed 5 characters']
  },
  source: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, 'Source cannot exceed 50 characters'],
    default: 'website'
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
  // Test Preferences
  preferredTestDate: {
    type: String,
    required: [true, 'Preferred entrance test date is required'],
    trim: true
  },
  preferredTestCentre: {
    type: String,
    required: [true, 'Preferred test centre is required'],
    trim: true,
    maxlength: [200, 'Preferred test centre cannot exceed 200 characters']
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
    required: false,
    trim: true,
    enum: ['male', 'female', 'other'],
    maxlength: [20, 'Gender cannot exceed 20 characters']
  },
  dateOfBirth: {
    type: String,
    required: false,
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
    required: false,
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  nationality: {
    type: String,
    required: false,
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
    required: false,
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
  // Guardian Details
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
  // Additional Academic Fields
  previousGrade: {
    type: String,
    required: false,
    trim: true,
    maxlength: [10, 'Previous grade cannot exceed 10 characters']
  },
  classSeekingAdmission: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, 'Class seeking admission cannot exceed 50 characters']
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
    required: false,
    default: false
  },
  parentGuardianName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Parent/Guardian name cannot exceed 100 characters']
  },
  declarationDate: {
    type: String,
    required: false,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved', 'closed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
enquiryFormSchema.index({ email: 1 });
enquiryFormSchema.index({ status: 1 });
enquiryFormSchema.index({ createdAt: -1 });

export default mongoose.model<IEnquiryForm>('EnquiryForm', enquiryFormSchema);
