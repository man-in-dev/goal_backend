import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerCounselling extends Document {
  // Student Information
  studentName: string;
  mobileNo: string;
  class: string;
  city: string;
  institute: string; // Currently studying in which institute
  examPreparation: string; // NEET/JEE or other
  
  status: 'pending' | 'contacted' | 'counselled' | 'closed';
  source?: string; // Track where request came from
  createdAt: Date;
  updatedAt: Date;
  notes?: string; // Admin notes
}

const careerCounsellingSchema = new Schema<ICareerCounselling>({
  studentName: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
    maxlength: [100, 'Student name cannot exceed 100 characters']
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true,
    maxlength: [50, 'Class cannot exceed 50 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters']
  },
  institute: {
    type: String,
    required: [true, 'Institute name is required'],
    trim: true,
    maxlength: [200, 'Institute name cannot exceed 200 characters']
  },
  examPreparation: {
    type: String,
    required: [true, 'Exam preparation choice is required'],
    trim: true,
    enum: ['NEET', 'JEE', 'NEET & JEE', 'Other']
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'contacted', 'counselled', 'closed']
  },
  source: {
    type: String,
    default: 'website',
    trim: true
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
careerCounsellingSchema.pre('save', function(next: any) {
  this.updatedAt = new Date();
  next();
});

// Update the updatedAt field on updates using Query middleware
careerCounsellingSchema.pre('updateOne', function(next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

careerCounsellingSchema.pre('findOneAndUpdate', function(next: any) {
  this.set({ updatedAt: new Date() });
  next();
});

export default mongoose.model<ICareerCounselling>('CareerCounselling', careerCounsellingSchema);
