import mongoose, { Document, Schema } from 'mongoose';

export interface ISummerCampRegistration extends Document {
  studentName: string;
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
  status: 'pending' | 'contacted' | 'resolved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const summerCampRegistrationSchema = new Schema<ISummerCampRegistration>({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    trim: true,
  },
  dob: {
    type: String,
    required: [true, 'Date of birth is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
  },
  district: {
    type: String,
    required: [true, 'District is required'],
  },
  postOffice: {
    type: String,
    trim: true,
  },
  pinCode: {
    type: String,
    required: [true, 'Pin code is required'],
  },
  studentMobile: {
    type: String,
    required: [true, 'Student mobile is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  studentWhatsApp: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  parentMobile: {
    type: String,
    required: [true, 'Parent mobile is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  parentWhatsApp: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  currentClass: {
    type: String,
    required: [true, 'Current class is required'],
  },
  schoolName: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
  },
  schoolAddress: {
    type: String,
    trim: true,
  },
  examCenter: {
    type: String,
    required: [true, 'Exam center is required'],
  },
  photograph: {
    type: String,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved', 'rejected'],
    default: 'pending',
  }
}, {
  timestamps: true,
});

// Indexes
summerCampRegistrationSchema.index({ studentMobile: 1 });
summerCampRegistrationSchema.index({ rollNumber: 1 });
summerCampRegistrationSchema.index({ status: 1 });

export default mongoose.model<ISummerCampRegistration>('SummerCampRegistration', summerCampRegistrationSchema);
