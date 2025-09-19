import AdmissionEnquiry, {
  IAdmissionEnquiry,
} from "../models/AdmissionEnquiry";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class AdmissionService {
  static async createEnquiry(enquiryData: {
    name: string;
    email: string;
    phone: string;
    course: string;
    studyLevel: string;
    address?: string;
    message?: string;
    source?: string;
  }): Promise<IAdmissionEnquiry> {
    // Check for duplicate enquiry from same email in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingEnquiry = await AdmissionEnquiry.findOne({
      email: enquiryData.email,
      createdAt: { $gte: oneDayAgo },
    });

    if (existingEnquiry) {
      throw new CustomError(
        "An enquiry has already been submitted with this email in the last 24 hours",
        400
      );
    }

    const enquiry = await AdmissionEnquiry.create({
      ...enquiryData,
      source: enquiryData.source || "website",
    });

    logger.info("Admission enquiry created successfully", {
      enquiryId: enquiry._id,
      email: enquiry.email,
      course: enquiry.course,
    });

    return enquiry;
  }

  static async getAllEnquiries(
    page: number = 1,
    limit: number = 10,
    status?: string,
    course?: string
  ): Promise<{
    enquiries: IAdmissionEnquiry[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (course) {
      query.course = course;
    }

    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
      AdmissionEnquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AdmissionEnquiry.countDocuments(query),
    ]);

    return {
      enquiries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getEnquiryById(enquiryId: string): Promise<IAdmissionEnquiry> {
    const enquiry = await AdmissionEnquiry.findById(enquiryId);

    if (!enquiry) {
      throw new CustomError("Admission enquiry not found", 404);
    }

    return enquiry;
  }

  static async updateEnquiryStatus(
    enquiryId: string,
    status: "pending" | "contacted" | "enrolled" | "rejected"
  ): Promise<IAdmissionEnquiry> {
    const enquiry = await AdmissionEnquiry.findByIdAndUpdate(
      enquiryId,
      { status },
      { new: true, runValidators: true }
    );

    if (!enquiry) {
      throw new CustomError("Admission enquiry not found", 404);
    }

    logger.info("Admission enquiry status updated", {
      enquiryId: enquiry._id,
      status: enquiry.status,
    });

    return enquiry;
  }

  static async getEnquiryStats(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    enrolled: number;
    rejected: number;
    byCourse: Record<string, number>;
  }> {
    const [total, pending, contacted, enrolled, rejected, byCourse] =
      await Promise.all([
        AdmissionEnquiry.countDocuments(),
        AdmissionEnquiry.countDocuments({ status: "pending" }),
        AdmissionEnquiry.countDocuments({ status: "contacted" }),
        AdmissionEnquiry.countDocuments({ status: "enrolled" }),
        AdmissionEnquiry.countDocuments({ status: "rejected" }),
        AdmissionEnquiry.aggregate([
          {
            $group: {
              _id: "$course",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const courseStats: Record<string, number> = {};
    byCourse.forEach((item: any) => {
      courseStats[item._id] = item.count;
    });

    return {
      total,
      pending,
      contacted,
      enrolled,
      rejected,
      byCourse: courseStats,
    };
  }

  static async deleteEnquiry(enquiryId: string): Promise<void> {
    const enquiry = await AdmissionEnquiry.findByIdAndDelete(enquiryId);

    if (!enquiry) {
      throw new CustomError("Admission enquiry not found", 404);
    }

    logger.info("Admission enquiry deleted", { enquiryId });
  }
}
