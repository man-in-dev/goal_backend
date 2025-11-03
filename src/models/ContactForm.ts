import mongoose, { Document, Schema } from "mongoose";

export interface IContactForm extends Document {
  name: string;
  email?: string;
  phone: string;
  state: string;
  district: string;
  studying?: string;
  course?: string;
  subject?: string;
  message?: string;
  location?: string;
  department?: string;
  status: "pending" | "contacted" | "resolved" | "closed";
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactFormSchema = new Schema<IContactForm>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow empty
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
      }
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9+\-\s()]+$/, "Please enter a valid phone number"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    studying: {
      type: String,
      required: false,
      trim: true,
      maxlength: [50, "Studying cannot exceed 50 characters"],
    },
    course: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "Course cannot exceed 100 characters"],
    },
    subject: {
      type: String,
      required: false,
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: false,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    location: {
      type: String,
      // required: [true, "Location is required"],
      trim: true,
    },
    department: {
      type: String,
      // required: [true, "Department is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "resolved", "closed"],
      default: "pending",
    },
    source: {
      type: String,
      default: "website",
      enum: ["website", "phone", "walk-in", "email"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
contactFormSchema.index({ email: 1, createdAt: -1 });
contactFormSchema.index({ status: 1, createdAt: -1 });
contactFormSchema.index({ state: 1, district: 1 });

// Pre-save middleware to clean data
contactFormSchema.pre("save", function (next) {
  // Clean phone number
  if (this.phone) {
    this.phone = this.phone.replace(/\s+/g, "").trim();
  }

  // Clean name
  if (this.name) {
    this.name = this.name.trim().replace(/\s+/g, " ");
  }

  next();
});

export default mongoose.model<IContactForm>("ContactForm", contactFormSchema);
