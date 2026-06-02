import mongoose, { Schema, Document } from 'mongoose';

export interface IPageSetting extends Document {
  page: string;
  key: string;
  value: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageSettingSchema: Schema = new Schema({
  page: { type: String, required: true },
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { timestamps: true });

PageSettingSchema.index({ page: 1, key: 1 }, { unique: true });

export default mongoose.model<IPageSetting>('PageSetting', PageSettingSchema);
