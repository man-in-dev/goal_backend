import mongoose, { Document, Schema } from "mongoose";

export interface ICareerApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  education: string;
  currentCompany?: string;
  expectedSalary?: string;
  skills: string;
  coverLetter: string;
  resumeUrl?: string;
  resumeFileName?: string;
  status: "pending" | "under-review" | "shortlisted" | "interview-scheduled" | "rejected" | "hired";
  source?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const careerApplicationSchema = new Schema<ICareerApplication>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]+$/, "Please enter a valid phone number"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
      enum: [
        "sous-chef",
        "physics-faculty", 
        "chemistry-faculty",
        "mathematics-faculty",
        "biology-faculty",
        "academic-counselor",
        "administrative-assistant",
        "marketing-executive",
        "other"
      ],
    },
    experience: {
      type: String,
      required: [true, "Experience level is required"],
      enum: ["0-1", "2-3", "4-6", "7-10", "10+"],
    },
    education: {
      type: String,
      required: [true, "Education level is required"],
      enum: ["high-school", "diploma", "bachelor", "master", "phd", "other"],
    },
    currentCompany: {
      type: String,
      trim: true,
      maxlength: [200, "Current company cannot exceed 200 characters"],
    },
    expectedSalary: {
      type: String,
      trim: true,
      maxlength: [50, "Expected salary cannot exceed 50 characters"],
    },
    skills: {
      type: String,
      required: [true, "Skills are required"],
      trim: true,
      maxlength: [2000, "Skills cannot exceed 2000 characters"],
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
      maxlength: [3000, "Cover letter cannot exceed 3000 characters"],
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    resumeFileName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "under-review", "shortlisted", "interview-scheduled", "rejected", "hired"],
      default: "pending",
    },
    source: {
      type: String,
      default: "website",
      enum: ["website", "job-portal", "referral", "walk-in", "email"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
careerApplicationSchema.index({ email: 1, createdAt: -1 });
careerApplicationSchema.index({ status: 1, createdAt: -1 });
careerApplicationSchema.index({ position: 1, status: 1 });
careerApplicationSchema.index({ fullName: "text", skills: "text", coverLetter: "text" });

// Pre-save middleware to clean data
careerApplicationSchema.pre("save", function (next) {
  // Clean phone number
  if (this.phone) {
    this.phone = this.phone.replace(/\s+/g, "").trim();
  }

  // Clean full name
  if (this.fullName) {
    this.fullName = this.fullName.trim().replace(/\s+/g, " ");
  }

  // Clean skills and cover letter
  if (this.skills) {
    this.skills = this.skills.trim();
  }

  if (this.coverLetter) {
    this.coverLetter = this.coverLetter.trim();
  }

  next();
});

export default mongoose.model<ICareerApplication>("CareerApplication", careerApplicationSchema);
