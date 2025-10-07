import CareerApplication, { ICareerApplication } from "../models/CareerApplication";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class CareerApplicationService {
  static async createApplication(applicationData: {
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
    source?: string;
  }): Promise<ICareerApplication> {
    // Check for duplicate application from same email for same position in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const existingApplication = await CareerApplication.findOne({
      email: applicationData.email,
      position: applicationData.position,
      createdAt: { $gte: thirtyDaysAgo },
    });

    if (existingApplication) {
      throw new CustomError(
        "An application for this position has already been submitted with this email in the last 30 days",
        400
      );
    }

    const application = await CareerApplication.create({
      ...applicationData,
      source: applicationData.source || "website",
    });

    logger.info("Career application created successfully", {
      applicationId: application._id,
      email: application.email,
      position: application.position,
    });

    return application;
  }

  static async getAllApplications(
    page: number = 1,
    limit: number = 10,
    status?: string,
    position?: string,
    search?: string
  ): Promise<{
    applications: ICareerApplication[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (position) {
      query.position = position;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      CareerApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CareerApplication.countDocuments(query),
    ]);

    return {
      applications,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getApplicationById(applicationId: string): Promise<ICareerApplication> {
    const application = await CareerApplication.findById(applicationId);

    if (!application) {
      throw new CustomError("Career application not found", 404);
    }

    return application;
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: "pending" | "under-review" | "shortlisted" | "interview-scheduled" | "rejected" | "hired",
    notes?: string
  ): Promise<ICareerApplication> {
    const updateData: any = { status };
    
    if (notes) {
      updateData.notes = notes;
    }

    const application = await CareerApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new CustomError("Career application not found", 404);
    }

    logger.info("Career application status updated", {
      applicationId: application._id,
      status: application.status,
    });

    return application;
  }

  static async getApplicationStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    shortlisted: number;
    interviewScheduled: number;
    rejected: number;
    hired: number;
    byPosition: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    const [
      total,
      pending,
      underReview,
      shortlisted,
      interviewScheduled,
      rejected,
      hired,
      byPosition,
      byStatus
    ] = await Promise.all([
      CareerApplication.countDocuments(),
      CareerApplication.countDocuments({ status: "pending" }),
      CareerApplication.countDocuments({ status: "under-review" }),
      CareerApplication.countDocuments({ status: "shortlisted" }),
      CareerApplication.countDocuments({ status: "interview-scheduled" }),
      CareerApplication.countDocuments({ status: "rejected" }),
      CareerApplication.countDocuments({ status: "hired" }),
      CareerApplication.aggregate([
        {
          $group: {
            _id: "$position",
            count: { $sum: 1 },
          },
        },
      ]),
      CareerApplication.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const positionStats: Record<string, number> = {};
    byPosition.forEach((item: any) => {
      positionStats[item._id] = item.count;
    });

    const statusStats: Record<string, number> = {};
    byStatus.forEach((item: any) => {
      statusStats[item._id] = item.count;
    });

    return {
      total,
      pending,
      underReview,
      shortlisted,
      interviewScheduled,
      rejected,
      hired,
      byPosition: positionStats,
      byStatus: statusStats,
    };
  }

  static async deleteApplication(applicationId: string): Promise<void> {
    const application = await CareerApplication.findByIdAndDelete(applicationId);

    if (!application) {
      throw new CustomError("Career application not found", 404);
    }

    logger.info("Career application deleted", { applicationId });
  }

  static async getRecentApplications(limit: number = 5): Promise<ICareerApplication[]> {
    return CareerApplication.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("fullName email position status createdAt")
      .lean();
  }
}
