import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaintFeedback extends Document {
  isGoalStudent: boolean;
  uid?: string;
  rollNo?: string;
  name: string;
  course: string;
  phone: string;
  email: string;
  type: 'complaint' | 'feedback' | 'suggestion';
  department: string;
  message: string;
  attachment?: string;
  attachmentAlt?: string;
  status: 'pending' | 'in_review' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const complaintFeedbackSchema = new Schema<IComplaintFeedback>({
  isGoalStudent: {
    type: Boolean,
    required: [true, 'Student type is required'],
    default: false
  },
  uid: {
    type: String,
    required: function() {
      return this.isGoalStudent;
    },
    trim: true,
    maxlength: [50, 'UID cannot exceed 50 characters']
  },
  rollNo: {
    type: String,
    required: function() {
      return this.isGoalStudent;
    },
    trim: true,
    maxlength: [20, 'Roll number cannot exceed 20 characters']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    maxlength: [100, 'Course cannot exceed 100 characters']
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
  type: {
    type: String,
    enum: ['complaint', 'feedback', 'suggestion'],
    required: [true, 'Type is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [100, 'Department cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  attachment: {
    type: String,
    trim: true
  },
  attachmentAlt: {
    type: String,
    trim: true,
    maxlength: [200, 'Attachment alt text cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'resolved', 'closed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for better query performance
complaintFeedbackSchema.index({ email: 1 });
complaintFeedbackSchema.index({ status: 1 });
complaintFeedbackSchema.index({ type: 1 });
complaintFeedbackSchema.index({ uid: 1 });
complaintFeedbackSchema.index({ rollNo: 1 });
complaintFeedbackSchema.index({ department: 1 });
complaintFeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IComplaintFeedback>('ComplaintFeedback', complaintFeedbackSchema);
