import mongoose, { Document, Schema } from 'mongoose';

export interface IPdf extends Document {
  name: string;
  url: string;
  filename: string;
  size: number;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PdfSchema = new Schema<IPdf>({
  name: {
    type: String,
    required: [true, 'Please add a document name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPdf>('Pdf', PdfSchema);
