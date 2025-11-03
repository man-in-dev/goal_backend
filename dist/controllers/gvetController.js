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
exports.deleteAnswerKey = exports.getAnswerKeys = exports.submitAnswerKey = void 0;
const response_1 = require("../utils/response");
const asyncHandler_1 = require("../utils/asyncHandler");
const GVETAnswerKey_1 = __importDefault(require("../models/GVETAnswerKey"));
// @desc    Submit GVET answer key suggestion
// @route   POST /api/gvet/answer-key
// @access  Public
exports.submitAnswerKey = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, rollNo, phone, questionNo, explanation } = req.body;
    const doc = yield GVETAnswerKey_1.default.create({ name, rollNo, phone, questionNo, explanation });
    return response_1.ApiResponse.success(res, {
        message: 'Answer key suggestion submitted successfully',
        data: { id: doc._id }
    });
}));
// @desc    Get GVET answer key submissions (admin)
// @route   GET /api/gvet/answer-key
// @access  Private (Admin)
exports.getAnswerKeys = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const search = req.query.search || '';
    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { rollNo: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { questionNo: { $regex: search, $options: 'i' } },
        ];
    }
    const total = yield GVETAnswerKey_1.default.countDocuments(query);
    const data = yield GVETAnswerKey_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    return response_1.ApiResponse.success(res, {
        message: 'GVET submissions fetched',
        data: {
            submissions: data,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        }
    });
}));
// @desc    Delete GVET answer key submission (admin)
// @route   DELETE /api/gvet/answer-key/:id
// @access  Private (Admin)
exports.deleteAnswerKey = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield GVETAnswerKey_1.default.findByIdAndDelete(id);
    return response_1.ApiResponse.success(res, { message: 'Submission deleted' });
}));
//# sourceMappingURL=gvetController.js.map