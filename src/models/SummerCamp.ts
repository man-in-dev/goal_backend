import mongoose, { Document, Schema } from 'mongoose';

export interface ISummerCamp extends Document {
  studentName: string;
  gtseRollNumber?: string;
  fatherName: string;
  fatherOccupation?: string;
  dob: string;
  category: string;
  gender: string;
  address: string;
  state: string;
  district: string;
  postOffice?: string;
  pinCode: string;
  studentMobile: string;
  studentWhatsApp?: string;
  parentMobile: string;
  parentWhatsApp?: string;
  currentClass: string;
  schoolName: string;
  schoolAddress?: string;
  examCenter: string;
  photograph?: string;
  rollNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'attended';
  createdAt: Date;
  updatedAt: Date;
}

const summerCampSchema = new Schema<ISummerCamp>({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  gtseRollNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'GTSE Roll Number cannot exceed 50 characters']
  },
  fatherName: {
    type: String,
    required: [true, "Father's name is required"],
    trim: true,
    maxlength: [100, "Father's name cannot exceed 100 characters"]
  },
  fatherOccupation: {
    type: String,
    trim: true,
    maxlength: [100, "Father's occupation cannot exceed 100 characters"]
  },
  dob: {
    type: String,
    required: [true, 'Date of birth is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    trim: true,
    maxlength: [20, 'Gender cannot exceed 20 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxlength: [100, 'State cannot exceed 100 characters']
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
    maxlength: [100, 'District cannot exceed 100 characters']
  },
  postOffice: {
    type: String,
    trim: true,
    maxlength: [100, 'Post office cannot exceed 100 characters']
  },
  pinCode: {
    type: String,
    required: [true, 'Pin code is required'],
    trim: true,
    maxlength: [10, 'Pin code cannot exceed 10 characters']
  },
  studentMobile: {
    type: String,
    required: [true, 'Student mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  studentWhatsApp: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  parentMobile: {
    type: String,
    required: [true, 'Parent mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  parentWhatsApp: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  currentClass: {
    type: String,
    required: [true, 'Presently studying class is required'],
    trim: true,
    maxlength: [50, 'Class cannot exceed 50 characters']
  },
  schoolName: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [200, 'School name cannot exceed 200 characters']
  },
  schoolAddress: {
    type: String,
    trim: true,
    maxlength: [500, 'School address cannot exceed 500 characters']
  },
  examCenter: {
    type: String,
    required: [true, 'Exam center is required'],
    trim: true,
    maxlength: [200, 'Exam center cannot exceed 200 characters']
  },
  photograph: {
    type: String,
    required: false,
    trim: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'attended'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for performance
summerCampSchema.index({ rollNumber: 1 });
summerCampSchema.index({ studentName: 1 });
summerCampSchema.index({ studentMobile: 1 });
summerCampSchema.index({ status: 1 });
summerCampSchema.index({ createdAt: -1 });

export default mongoose.model<ISummerCamp>('SummerCamp', summerCampSchema);
