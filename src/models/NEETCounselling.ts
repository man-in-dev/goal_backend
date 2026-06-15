import mongoose, { Document, Schema } from 'mongoose';

export interface INEETCounselling extends Document {
  // Student Information
  name: string;
  mobileNo: string;
  whatsappNo: string;
  homeTown: string;
  previousSchoolOrCoaching: string;
  category: 'Government Medical Colleges' | 'Private Medical Colleges' | 'Paramedical Colleges' | 'NEET Repeater Preparation & Strategy';
  
  // Generated PDF path
  pdfPath?: string;
  
  // Admin tracking
  status: 'pending' | 'contacted' | 'processed' | 'closed';
  notes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const neetCounsellingSchema = new Schema<INEETCounselling>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  whatsappNo: {
    type: String,
    required: [true, 'WhatsApp number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit WhatsApp number']
  },
  homeTown: {
    type: String,
    required: [true, 'Home town is required'],
    trim: true,
    maxlength: [100, 'Home town cannot exceed 100 characters']
  },
  previousSchoolOrCoaching: {
    type: String,
    required: [true, 'Previous school/coaching name is required'],
    trim: true,
    maxlength: [200, 'Previous school/coaching name cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Government Medical Colleges',
      'Private Medical Colleges',
      'Paramedical Colleges',
      'NEET Repeater Preparation & Strategy'
    ]
  },
  pdfPath: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'contacted', 'processed', 'closed']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
neetCounsellingSchema.pre('save', function(next: any) {
  this.updatedAt = new Date();
  next();
});

// Update the updatedAt field on updates using Query middleware
neetCounsellingSchema.pre('updateOne', function(next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

neetCounsellingSchema.pre('findOneAndUpdate', function(next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.model<INEETCounselling>('NEETCounselling', neetCounsellingSchema);
