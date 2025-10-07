"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CareerApplicationService = void 0;
const CareerApplication_1 = __importDefault(require("../models/CareerApplication"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class CareerApplicationService {
    static createApplication(applicationData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate application from same email for same position in last 30 days
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const existingApplication = yield CareerApplication_1.default.findOne({
                email: applicationData.email,
                position: applicationData.position,
                createdAt: { $gte: thirtyDaysAgo },
            });
            if (existingApplication) {
                throw new errorHandler_1.CustomError("An application for this position has already been submitted with this email in the last 30 days", 400);
            }
            const application = yield CareerApplication_1.default.create(Object.assign(Object.assign({}, applicationData), { source: applicationData.source || "website" }));
            logger_1.logger.info("Career application created successfully", {
                applicationId: application._id,
                email: application.email,
                position: application.position,
            });
            return application;
        });
    }
    static getAllApplications() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, status, position, search) {
            const query = {};
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
            const [applications, total] = yield Promise.all([
                CareerApplication_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                CareerApplication_1.default.countDocuments(query),
            ]);
            return {
                applications,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    static getApplicationById(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield CareerApplication_1.default.findById(applicationId);
            if (!application) {
                throw new errorHandler_1.CustomError("Career application not found", 404);
            }
            return application;
        });
    }
    static updateApplicationStatus(applicationId, status, notes) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = { status };
            if (notes) {
                updateData.notes = notes;
            }
            const application = yield CareerApplication_1.default.findByIdAndUpdate(applicationId, updateData, { new: true, runValidators: true });
            if (!application) {
                throw new errorHandler_1.CustomError("Career application not found", 404);
            }
            logger_1.logger.info("Career application status updated", {
                applicationId: application._id,
                status: application.status,
            });
            return application;
        });
    }
    static getApplicationStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, pending, underReview, shortlisted, interviewScheduled, rejected, hired, byPosition, byStatus] = yield Promise.all([
                CareerApplication_1.default.countDocuments(),
                CareerApplication_1.default.countDocuments({ status: "pending" }),
                CareerApplication_1.default.countDocuments({ status: "under-review" }),
                CareerApplication_1.default.countDocuments({ status: "shortlisted" }),
                CareerApplication_1.default.countDocuments({ status: "interview-scheduled" }),
                CareerApplication_1.default.countDocuments({ status: "rejected" }),
                CareerApplication_1.default.countDocuments({ status: "hired" }),
                CareerApplication_1.default.aggregate([
                    {
                        $group: {
                            _id: "$position",
                            count: { $sum: 1 },
                        },
                    },
                ]),
                CareerApplication_1.default.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            const positionStats = {};
            byPosition.forEach((item) => {
                positionStats[item._id] = item.count;
            });
            const statusStats = {};
            byStatus.forEach((item) => {
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
        });
    }
    static deleteApplication(applicationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield CareerApplication_1.default.findByIdAndDelete(applicationId);
            if (!application) {
                throw new errorHandler_1.CustomError("Career application not found", 404);
            }
            logger_1.logger.info("Career application deleted", { applicationId });
        });
    }
    static getRecentApplications() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            return CareerApplication_1.default.find()
                .sort({ createdAt: -1 })
                .limit(limit)
                .select("fullName email position status createdAt")
                .lean();
        });
    }
}
exports.CareerApplicationService = CareerApplicationService;
//# sourceMappingURL=careerApplicationService.js.map