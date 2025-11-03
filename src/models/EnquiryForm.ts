import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiryForm extends Document {
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
