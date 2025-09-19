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
exports.GVETService = void 0;
const GVETForm_1 = __importDefault(require("../models/GVETForm"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class GVETService {
    static createGVETForm(gvetData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate registration from same email
            const existingForm = yield GVETForm_1.default.findOne({
                email: gvetData.email,
            });
            if (existingForm) {
                throw new errorHandler_1.CustomError("A GVET form has already been submitted with this email", 400);
            }
            // Check for duplicate registration from same phone
            const existingPhoneForm = yield GVETForm_1.default.findOne({
                phone: gvetData.phone,
            });
            if (existingPhoneForm) {
                throw new errorHandler_1.CustomError("A GVET form has already been submitted with this phone number", 400);
            }
            const gvetForm = yield GVETForm_1.default.create(Object.assign(Object.assign({}, gvetData), { dateOfBirth: new Date(gvetData.dateOfBirth), examDate: new Date(gvetData.examDate), source: gvetData.source || "website" }));
            logger_1.logger.info("GVET form created successfully", {
                formId: gvetForm._id,
                email: gvetForm.email,
                registrationNumber: gvetForm.registrationNumber,
            });
            return gvetForm;
        });
    }
    static getAllGVETForms() {
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
                GVETForm_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                GVETForm_1.default.countDocuments(query),
            ]);
            return {
                forms,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    static getGVETFormById(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GVETForm_1.default.findById(formId);
            if (!form) {
                throw new errorHandler_1.CustomError("GVET form not found", 404);
            }
            return form;
        });
    }
    static getGVETFormByRegistrationNumber(registrationNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GVETForm_1.default.findOne({ registrationNumber });
            if (!form) {
                throw new errorHandler_1.CustomError("GVET form not found", 404);
            }
            return form;
        });
    }
    static updateGVETFormStatus(formId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GVETForm_1.default.findByIdAndUpdate(formId, { status }, { new: true, runValidators: true });
            if (!form) {
                throw new errorHandler_1.CustomError("GVET form not found", 404);
            }
            logger_1.logger.info("GVET form status updated", {
                formId: form._id,
                status: form.status,
                registrationNumber: form.registrationNumber,
            });
            return form;
        });
    }
    static getGVETStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, pending, verified, approved, rejected, byExamCenter, byClass] = yield Promise.all([
                GVETForm_1.default.countDocuments(),
                GVETForm_1.default.countDocuments({ status: "pending" }),
                GVETForm_1.default.countDocuments({ status: "verified" }),
                GVETForm_1.default.countDocuments({ status: "approved" }),
                GVETForm_1.default.countDocuments({ status: "rejected" }),
                GVETForm_1.default.aggregate([
                    {
                        $group: {
                            _id: "$examCenter",
                            count: { $sum: 1 },
                        },
                    },
                ]),
                GVETForm_1.default.aggregate([
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
    static deleteGVETForm(formId) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = yield GVETForm_1.default.findByIdAndDelete(formId);
            if (!form) {
                throw new errorHandler_1.CustomError("GVET form not found", 404);
            }
            logger_1.logger.info("GVET form deleted", { formId, registrationNumber: form.registrationNumber });
        });
    }
}
exports.GVETService = GVETService;
//# sourceMappingURL=gvetService.js.map