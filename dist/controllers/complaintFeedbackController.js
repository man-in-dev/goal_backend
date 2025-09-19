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
exports.getComplaintFeedbackStats = exports.deleteComplaintFeedback = exports.updateComplaintFeedback = exports.createComplaintFeedback = exports.getComplaintFeedbackById = exports.getAllComplaintsFeedback = void 0;
const ComplaintFeedback_1 = __importDefault(require("../models/ComplaintFeedback"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
// Get all complaints and feedback
exports.getAllComplaintsFeedback = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status, type, search } = req.query;
    const query = {};
    if (status)
        query.status = status;
    if (type)
        query.type = type;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { uid: { $regex: search, $options: 'i' } },
            { rollNo: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } },
            { department: { $regex: search, $options: 'i' } },
            { message: { $regex: search, $options: 'i' } }
        ];
    }
    const complaintsFeedback = yield ComplaintFeedback_1.default.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));
    const total = yield ComplaintFeedback_1.default.countDocuments(query);
    (0, response_1.successResponse)(res, {
        complaintsFeedback,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total
    });
}));
// Get single complaint/feedback
exports.getComplaintFeedbackById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintFeedback = yield ComplaintFeedback_1.default.findById(req.params.id);
    if (!complaintFeedback) {
        return (0, response_1.errorResponse)(res, 'Complaint/Feedback not found', 404);
    }
    (0, response_1.successResponse)(res, complaintFeedback);
}));
// Create new complaint/feedback
exports.createComplaintFeedback = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintFeedback = yield ComplaintFeedback_1.default.create(req.body);
    (0, response_1.successResponse)(res, complaintFeedback, 'Complaint/Feedback submitted successfully', 201);
}));
// Update complaint/feedback
exports.updateComplaintFeedback = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintFeedback = yield ComplaintFeedback_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!complaintFeedback) {
        return (0, response_1.errorResponse)(res, 'Complaint/Feedback not found', 404);
    }
    (0, response_1.successResponse)(res, complaintFeedback, 'Complaint/Feedback updated successfully');
}));
// Delete complaint/feedback
exports.deleteComplaintFeedback = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const complaintFeedback = yield ComplaintFeedback_1.default.findByIdAndDelete(req.params.id);
    if (!complaintFeedback) {
        return (0, response_1.errorResponse)(res, 'Complaint/Feedback not found', 404);
    }
    (0, response_1.successResponse)(res, null, 'Complaint/Feedback deleted successfully');
}));
// Get complaint/feedback statistics
exports.getComplaintFeedbackStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield ComplaintFeedback_1.default.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                complaints: { $sum: { $cond: [{ $eq: ['$type', 'complaint'] }, 1, 0] } },
                feedback: { $sum: { $cond: [{ $eq: ['$type', 'feedback'] }, 1, 0] } },
                suggestions: { $sum: { $cond: [{ $eq: ['$type', 'suggestion'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                inReview: { $sum: { $cond: [{ $eq: ['$status', 'in_review'] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
            }
        }
    ]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayComplaints = yield ComplaintFeedback_1.default.countDocuments({
        createdAt: { $gte: today }
    });
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekComplaints = yield ComplaintFeedback_1.default.countDocuments({
        createdAt: { $gte: thisWeek }
    });
    (0, response_1.successResponse)(res, Object.assign(Object.assign({}, stats[0]), { todayComplaints,
        weekComplaints }));
}));
//# sourceMappingURL=complaintFeedbackController.js.map