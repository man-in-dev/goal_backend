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
exports.downloadEnquiriesCSV = exports.getEnquiryStats = exports.deleteEnquiry = exports.updateEnquiry = exports.createEnquiry = exports.getEnquiryById = exports.getAllEnquiries = void 0;
const EnquiryForm_1 = __importDefault(require("../models/EnquiryForm"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
// Get all enquiry forms
exports.getAllEnquiries = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, status, search } = req.query;
    const query = {};
    if (status)
        query.status = status;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } },
            { studying: { $regex: search, $options: 'i' } },
            { state: { $regex: search, $options: 'i' } },
            { district: { $regex: search, $options: 'i' } }
        ];
    }
    const enquiries = yield EnquiryForm_1.default.find(query)
        .sort({ createdAt: -1 })
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));
    const total = yield EnquiryForm_1.default.countDocuments(query);
    (0, response_1.successResponse)(res, {
        enquiries,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total
    });
}));
// Get single enquiry form
exports.getEnquiryById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = yield EnquiryForm_1.default.findById(req.params.id);
    if (!enquiry) {
        return (0, response_1.errorResponse)(res, 'Enquiry form not found', 404);
    }
    (0, response_1.successResponse)(res, enquiry);
}));
// Create new enquiry form
exports.createEnquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = yield EnquiryForm_1.default.create(req.body);
    (0, response_1.successResponse)(res, enquiry, 'Enquiry form created successfully', 201);
}));
// Update enquiry form
exports.updateEnquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = yield EnquiryForm_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enquiry) {
        return (0, response_1.errorResponse)(res, 'Enquiry form not found', 404);
    }
    (0, response_1.successResponse)(res, enquiry, 'Enquiry form updated successfully');
}));
// Delete enquiry form
exports.deleteEnquiry = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const enquiry = yield EnquiryForm_1.default.findByIdAndDelete(req.params.id);
    if (!enquiry) {
        return (0, response_1.errorResponse)(res, 'Enquiry form not found', 404);
    }
    (0, response_1.successResponse)(res, null, 'Enquiry form deleted successfully');
}));
// Get enquiry statistics
exports.getEnquiryStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield EnquiryForm_1.default.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
                contacted: { $sum: { $cond: [{ $eq: ['$status', 'contacted'] }, 1, 0] } },
                resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
                closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
            }
        }
    ]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnquiries = yield EnquiryForm_1.default.countDocuments({
        createdAt: { $gte: today }
    });
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekEnquiries = yield EnquiryForm_1.default.countDocuments({
        createdAt: { $gte: thisWeek }
    });
    (0, response_1.successResponse)(res, Object.assign(Object.assign({}, stats[0]), { todayEnquiries,
        weekEnquiries }));
}));
// Download enquiries as CSV
exports.downloadEnquiriesCSV = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, search } = req.query;
    const query = {};
    if (status)
        query.status = status;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } },
            { studying: { $regex: search, $options: 'i' } },
            { state: { $regex: search, $options: 'i' } },
            { district: { $regex: search, $options: 'i' } }
        ];
    }
    const enquiries = yield EnquiryForm_1.default.find(query).sort({ createdAt: -1 });
    // CSV headers
    const headers = [
        'ID',
        'Name',
        'Phone',
        'Email',
        'Studying',
        'Course',
        'State',
        'District',
        'Address',
        'Query',
        'Country Code',
        'Source',
        'Status',
        'Created At',
        'Updated At'
    ];
    // Convert data to CSV format
    const csvData = enquiries.map(enquiry => [
        enquiry._id,
        enquiry.name || '',
        enquiry.phone || '',
        enquiry.email || '',
        enquiry.studying || enquiry.studyLevel || '',
        enquiry.course || '',
        enquiry.state || '',
        enquiry.district || '',
        enquiry.address || '',
        enquiry.query || enquiry.message || '',
        enquiry.countryCode || '',
        enquiry.source || '',
        enquiry.status || '',
        enquiry.createdAt ? new Date(enquiry.createdAt).toISOString() : '',
        enquiry.updatedAt ? new Date(enquiry.updatedAt).toISOString() : ''
    ]);
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => typeof field === 'string' && field.includes(',')
            ? `"${field.replace(/"/g, '""')}"`
            : field).join(','))
    ].join('\n');
    // Set response headers for CSV download
    const filename = `enquiries_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(csvContent);
}));
//# sourceMappingURL=enquiryController.js.map