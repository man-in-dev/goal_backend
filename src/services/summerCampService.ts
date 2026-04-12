import SummerCamp, { ISummerCamp } from "../models/SummerCamp";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class SummerCampService {
  static async createRegistration(registrationData: any): Promise<ISummerCamp> {
    // Check for duplicate registration by mobile
    const existingRegistration = await SummerCamp.findOne({
      studentMobile: registrationData.studentMobile,
    });

    if (existingRegistration) {
      throw new CustomError(
        "A registration already exists with this mobile number.",
        400
      );
    }

    // Generate roll number
    // Find the latest registration to get the next roll number
    const lastRegistration = await SummerCamp.findOne().sort({ rollNumber: -1 });
    let nextRollNumber = "2026001";

    if (lastRegistration && lastRegistration.rollNumber) {
      const lastRollNum = parseInt(lastRegistration.rollNumber);
      nextRollNumber = (lastRollNum + 1).toString();
    }

    const registration = await SummerCamp.create({
      ...registrationData,
      rollNumber: nextRollNumber,
    });

    logger.info("Summer Camp registration created successfully", {
      registrationId: registration._id,
      rollNumber: registration.rollNumber,
      studentName: registration.studentName,
    });

    return registration;
  }

  static async getAllRegistrations(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{
    registrations: ISummerCamp[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { studentMobile: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [registrations, total] = await Promise.all([
      SummerCamp.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SummerCamp.countDocuments(query),
    ]);

    return {
      registrations: registrations as ISummerCamp[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getRegistrationById(id: string): Promise<ISummerCamp> {
    const registration = await SummerCamp.findById(id);

    if (!registration) {
      throw new CustomError("Registration not found", 404);
    }

    return registration;
  }

  static async updateStatus(
    id: string,
    status: "pending" | "approved" | "rejected" | "attended"
  ): Promise<ISummerCamp> {
    const registration = await SummerCamp.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      throw new CustomError("Registration not found", 404);
    }

    logger.info("Summer Camp registration status updated", {
      id,
      status: registration.status,
    });

    return registration;
  }

  static async deleteRegistration(id: string): Promise<void> {
    const registration = await SummerCamp.findByIdAndDelete(id);

    if (!registration) {
      throw new CustomError("Registration not found", 404);
    }

    logger.info("Summer Camp registration deleted", { id });
  }

  static async getStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    attended: number;
    byCenter: any[];
  }> {
    const [total, pending, approved, rejected, attended, byCenter] = await Promise.all([
      SummerCamp.countDocuments(),
      SummerCamp.countDocuments({ status: "pending" }),
      SummerCamp.countDocuments({ status: "approved" }),
      SummerCamp.countDocuments({ status: "rejected" }),
      SummerCamp.countDocuments({ status: "attended" }),
      SummerCamp.aggregate([
        {
          $group: {
            _id: "$examCenter",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    return {
      total,
      pending,
      approved,
      rejected,
      attended,
      byCenter,
    };
  }
}
