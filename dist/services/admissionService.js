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
exports.AdmissionService = void 0;
const AdmissionEnquiry_1 = __importDefault(require("../models/AdmissionEnquiry"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class AdmissionService {
    static createEnquiry(enquiryData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate enquiry from same email in last 24 hours
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const existingEnquiry = yield AdmissionEnquiry_1.default.findOne({
                email: enquiryData.email,
                createdAt: { $gte: oneDayAgo },
            });
            if (existingEnquiry) {
                throw new errorHandler_1.CustomError("An enquiry has already been submitted with this email in the last 24 hours", 400);
            }
            const enquiry = yield AdmissionEnquiry_1.default.create(Object.assign(Object.assign({}, enquiryData), { source: enquiryData.source || "website" }));
            logger_1.logger.info("Admission enquiry created successfully", {
                enquiryId: enquiry._id,
                email: enquiry.email,
                course: enquiry.course,
            });
            return enquiry;
        });
    }
    static getAllEnquiries() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, status, course) {
            const query = {};
            if (status) {
                query.status = status;
            }
            if (course) {
                query.course = course;
            }
            const skip = (page - 1) * limit;
            const [enquiries, total] = yield Promise.all([
                AdmissionEnquiry_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                AdmissionEnquiry_1.default.countDocuments(query),
            ]);
            return {
                enquiries,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    static getEnquiryById(enquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enquiry = yield AdmissionEnquiry_1.default.findById(enquiryId);
            if (!enquiry) {
                throw new errorHandler_1.CustomError("Admission enquiry not found", 404);
            }
            return enquiry;
        });
    }
    static updateEnquiryStatus(enquiryId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const enquiry = yield AdmissionEnquiry_1.default.findByIdAndUpdate(enquiryId, { status }, { new: true, runValidators: true });
            if (!enquiry) {
                throw new errorHandler_1.CustomError("Admission enquiry not found", 404);
            }
            logger_1.logger.info("Admission enquiry status updated", {
                enquiryId: enquiry._id,
                status: enquiry.status,
            });
            return enquiry;
        });
    }
    static getEnquiryStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, pending, contacted, enrolled, rejected, byCourse] = yield Promise.all([
                AdmissionEnquiry_1.default.countDocuments(),
                AdmissionEnquiry_1.default.countDocuments({ status: "pending" }),
                AdmissionEnquiry_1.default.countDocuments({ status: "contacted" }),
                AdmissionEnquiry_1.default.countDocuments({ status: "enrolled" }),
                AdmissionEnquiry_1.default.countDocuments({ status: "rejected" }),
                AdmissionEnquiry_1.default.aggregate([
                    {
                        $group: {
                            _id: "$course",
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            const courseStats = {};
            byCourse.forEach((item) => {
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
        });
    }
    static deleteEnquiry(enquiryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enquiry = yield AdmissionEnquiry_1.default.findByIdAndDelete(enquiryId);
            if (!enquiry) {
                throw new errorHandler_1.CustomError("Admission enquiry not found", 404);
            }
            logger_1.logger.info("Admission enquiry deleted", { enquiryId });
        });
    }
}
exports.AdmissionService = AdmissionService;
//# sourceMappingURL=admissionService.js.map