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
exports.GAETService = void 0;
const GAETForm_1 = __importDefault(require("../models/GAETForm"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class GAETService {
    static createGAETForm(gaetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate registration from same email
            const existingForm = yield GAETForm_1.default.findOne({
                email: gaetData.email,
            });
            if (existingForm) {
                throw new errorHandler_1.CustomError("A GAET form has already been submitted with this email", 400);
            }
            // Check for duplicate registration from same phone
            const existingPhoneForm = yield GAETForm_1.default.findOne({
                phone: gaetData.phone,
            });
            if (existingPhoneForm) {
                throw new errorHandler_1.CustomError("A GAET form has already been submitted with this phone number", 400);
            }
            const gaetForm = yield GAETForm_1.default.create(Object.assign(Object.assign({}, gaetData), { dateOfBirth: new Date(gaetData.dateOfBirth), examDate: new Date(gaetData.examDate), source: gaetData.source || "website" }));
            logger_1.logger.info("GAET form created successfully", {
                formId: gaetForm._id,
                email: gaetForm.email,
                registrationNumber: gaetForm.registrationNumber,
            });
            return gaetForm;
        });
    }
    static getAllGAETForms() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, status, examCenter) {
            const query = {};
            if (status) {
                query.status = status;
            }
            if (examCenter) {
                query.examCenter = examCenter;
            }
            const skip = (page - 1) * limit;
            const [forms, total] = yield Promise.all([
                GAETForm_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                GAETForm_1.default.countDocuments(query),
            ]);
            return {
                forms,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    static getGAETFormById(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GAETForm_1.default.findById(formId);
            if (!form) {
                throw new errorHandler_1.CustomError("GAET form not found", 404);
            }
            return form;
        });
    }
    static getGAETFormByRegistrationNumber(registrationNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GAETForm_1.default.findOne({ registrationNumber });
            if (!form) {
                throw new errorHandler_1.CustomError("GAET form not found", 404);
            }
            return form;
        });
    }
    static updateGAETFormStatus(formId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GAETForm_1.default.findByIdAndUpdate(formId, { status }, { new: true, runValidators: true });
            if (!form) {
                throw new errorHandler_1.CustomError("GAET form not found", 404);
            }
            logger_1.logger.info("GAET form status updated", {
                formId: form._id,
                status: form.status,
                registrationNumber: form.registrationNumber,
            });
            return form;
        });
    }
    static getGAETStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, pending, verified, approved, rejected, byExamCenter, byClass] = yield Promise.all([
                GAETForm_1.default.countDocuments(),
                GAETForm_1.default.countDocuments({ status: "pending" }),
                GAETForm_1.default.countDocuments({ status: "verified" }),
                GAETForm_1.default.countDocuments({ status: "approved" }),
                GAETForm_1.default.countDocuments({ status: "rejected" }),
                GAETForm_1.default.aggregate([
                    {
                        $group: {
                            _id: "$examCenter",
                            count: { $sum: 1 },
                        },
                    },
                ]),
                GAETForm_1.default.aggregate([
                    {
                        $group: {
                            _id: "$currentClass",
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            const examCenterStats = {};
            byExamCenter.forEach((item) => {
                examCenterStats[item._id] = item.count;
            });
            const classStats = {};
            byClass.forEach((item) => {
                classStats[item._id] = item.count;
            });
            return {
                total,
                pending,
                verified,
                approved,
                rejected,
                byExamCenter: examCenterStats,
                byClass: classStats,
            };
        });
    }
    static deleteGAETForm(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GAETForm_1.default.findByIdAndDelete(formId);
            if (!form) {
                throw new errorHandler_1.CustomError("GAET form not found", 404);
            }
            logger_1.logger.info("GAET form deleted", { formId, registrationNumber: form.registrationNumber });
        });
    }
}
exports.GAETService = GAETService;
//# sourceMappingURL=gaetService.js.map