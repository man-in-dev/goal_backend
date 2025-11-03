import mongoose, { Document, Schema } from 'mongoose';

export interface IGVETAnswerKey extends Document {
  name: string;
  rollNo: string;
  phone: string;
  questionNo: string;
  explanation: string;
  createdAt: Date;
  updatedAt: Date;
}

const gvetAnswerKeySchema = new Schema<IGVETAnswerKey>({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  rollNo: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  questionNo: { type: String, required: true, trim: true, maxlength: 50 },
  explanation: { type: String, required: true, trim: true, maxlength: 2000 },
}, {
  timestamps: true,
});

gvetAnswerKeySchema.index({ createdAt: -1 });

const GVETAnswerKey = mongoose.models.GVETAnswerKey || mongoose.model<IGVETAnswerKey>('GVETAnswerKey', gvetAnswerKeySchema);

export default GVETAnswerKey;


