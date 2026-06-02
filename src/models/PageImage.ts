import mongoose, { Document, Schema } from 'mongoose';

export interface IPageImage extends Document {
  page: string; 
  imageUrl: string;
  imageAlt?: string;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

const pageImageSchema = new Schema<IPageImage>({
  page: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model<IPageImage>('PageImage', pageImageSchema);
