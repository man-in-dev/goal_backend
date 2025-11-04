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
exports.upload = exports.getResultsByRollNo = exports.getExamComparison = exports.getResultsByBatch = exports.getResultsByCourse = exports.getResultStats = exports.uploadCSVResults = exports.deleteMultipleResults = exports.deleteResult = exports.updateResult = exports.createResult = exports.getResultById = exports.getAllResults = void 0;
const Result_1 = __importDefault(require("../models/Result"));
const asyncHandler_1 = require("../utils/asyncHandler");
const response_1 = require("../utils/response");
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
// Configure multer for CSV file upload
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
exports.upload = upload;
// Get all results
exports.getAllResults = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, course, batch, branch, testDate, search, testType, batchYear, batchCode, sortBy = 'testDate', sortOrder = 'desc' } = req.query;
    const query = {};
    if (course)
        query.course = course;
    if (batch)
        query.batch = batch;
    if (branch)
        query.branch = branch;
    if (testType)
        query.testType = testType;
    if (batchYear)
        query.batchYear = parseInt(batchYear);
    if (batchCode)
        query.batchCode = batchCode;
    if (testDate) {
        const date = new Date(testDate);
        query.testDate = {
            $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        };
    }
    if (search) {
        query.$or = [
            { studentName: { $regex: search, $options: 'i' } },
            { rollNo: { $regex: search, $options: 'i' } },
            { course: { $regex: search, $options: 'i' } }
        ];
    }
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const results = yield Result_1.default.find(query)
        .sort(sortOptions)
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit));
    const total = yield Result_1.default.countDocuments(query);
    (0, response_1.successResponse)(res, {
        results,
        pagination: {
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total,
            limit: Number(limit)
        }
    });
}));
// Get single result (by rollNo and batch)
exports.getResultById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNo, batch } = req.params;
    console.log('Searching for results:', { rollNo, batch });
    // Try multiple batch formats to match the database
    let query = { rollNo };
    if (batch && batch !== 'default') {
        // Try different batch formats
        const batchFormats = [
            batch + " Batch",
            batch + " batch",
            batch,
            batch.trim(),
            `BTBM${batch.slice(-2)}-01`, // Example: 2025 -> BTBM25-01
        ];
        console.log('Trying batch formats:', batchFormats);
        // First try with batch filter
        query.batch = { $in: batchFormats };
    }
    let results = yield Result_1.default.find(query).sort({ testDate: -1 });
    console.log(`Found ${results.length} results with batch filter`);
    // If no results found with batch, try without batch filter
    if (results.length === 0 && batch && batch !== 'default') {
        console.log('No results with batch, trying without batch filter');
        query = { rollNo };
        results = yield Result_1.default.find(query).sort({ testDate: -1 });
        console.log(`Found ${results.length} results without batch filter`);
        // Log unique batch values for this rollNo to help debug
        if (results.length > 0) {
            const uniqueBatches = [...new Set(results.map(r => r.batch))];
            console.log('Available batch values for this rollNo:', uniqueBatches);
        }
    }
    if (!results || results.length === 0) {
        return (0, response_1.errorResponse)(res, 'No results found for this roll number', 404);
    }
    // Get student info from first result
    const studentInfo = {
        rollNo: results[0].rollNo,
        studentName: results[0].studentName,
        course: results[0].course,
        branch: results[0].branch
    };
    // Group results by test type (CLASSROOM TEST or SURPRISE TEST based on course name)
    const classroomTests = results.filter(r => !r.course.toLowerCase().includes('surprise'));
    const surpriseTests = results.filter(r => r.course.toLowerCase().includes('surprise'));
    (0, response_1.successResponse)(res, {
        studentInfo,
        classroomTests,
        surpriseTests,
        allResults: results
    });
}));
// Create new result
exports.createResult = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Result_1.default.create(req.body);
    (0, response_1.successResponse)(res, result, 'Result created successfully', 201);
}));
// Update result
exports.updateResult = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Result_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!result) {
        return (0, response_1.errorResponse)(res, 'Result not found', 404);
    }
    (0, response_1.successResponse)(res, result, 'Result updated successfully');
}));
// Delete result
exports.deleteResult = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Result_1.default.findByIdAndDelete(req.params.id);
    if (!result) {
        return (0, response_1.errorResponse)(res, 'Result not found', 404);
    }
    (0, response_1.successResponse)(res, null, 'Result deleted successfully');
}));
// Delete multiple results
exports.deleteMultipleResults = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return (0, response_1.errorResponse)(res, 'Result IDs are required', 400);
    }
    const result = yield Result_1.default.deleteMany({ _id: { $in: ids } });
    (0, response_1.successResponse)(res, { deletedCount: result.deletedCount }, `${result.deletedCount} results deleted successfully`);
}));
// Upload CSV results
exports.uploadCSVResults = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return (0, response_1.errorResponse)(res, 'CSV file is required', 400);
    }
    const results = [];
    const errors = [];
    let rowNumber = 0;
    return new Promise((resolve, reject) => {
        if (!req.file) {
            return resolve((0, response_1.errorResponse)(res, 'No file uploaded', 400));
        }
        const stream = stream_1.Readable.from(req.file.buffer.toString());
        stream
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            rowNumber++;
            try {
                // Validate and transform the data
                const course = (_a = row.COURSE) === null || _a === void 0 ? void 0 : _a.trim();
                const batch = (_b = row.BATCH) === null || _b === void 0 ? void 0 : _b.trim();
                const testDate = new Date(row['TEST DATE']);
                // Generate new fields if not provided
                const testType = ((_c = row['TEST TYPE']) === null || _c === void 0 ? void 0 : _c.trim()) ||
                    ((course === null || course === void 0 ? void 0 : course.toLowerCase().includes('surprise')) ? 'SURPRISE_TEST' : 'CLASSROOM_TEST');
                const examId = ((_d = row['EXAM ID']) === null || _d === void 0 ? void 0 : _d.trim()) ||
                    `${testType === 'SURPRISE_TEST' ? 'ST' : 'CT'}-${testDate.toISOString().split('T')[0]}-${batch === null || batch === void 0 ? void 0 : batch.replace(/\s+/g, '-')}`;
                const batchYear = row['BATCH YEAR'] ? parseInt(row['BATCH YEAR']) :
                    (batch ? parseInt(((_e = batch.match(/\d{4}/)) === null || _e === void 0 ? void 0 : _e[0]) || new Date().getFullYear().toString()) : undefined);
                const batchCode = ((_f = row['BATCH CODE']) === null || _f === void 0 ? void 0 : _f.trim()) || batch;
                const totalStudents = row['TOTAL STUDENTS'] ? parseInt(row['TOTAL STUDENTS']) : undefined;
                const resultData = Object.assign(Object.assign(Object.assign({ course,
                    testDate, rank: parseInt(row.RANK), rollNo: (_g = row['ROLL NO']) === null || _g === void 0 ? void 0 : _g.trim(), studentName: (_h = row['STUDENT NAME']) === null || _h === void 0 ? void 0 : _h.trim(), tq: parseInt(row.TQ) || 0, ta: parseInt(row.TA) || 0, tr: parseInt(row.TR) || 0, tw: parseInt(row.TW) || 0, tl: parseInt(row.TL) || 0, pr: parseInt(row.PR) || 0, pw: parseInt(row.PW) || 0, cr: parseInt(row.CR) || 0, cw: parseInt(row.CW) || 0, br: parseInt(row.BR) || 0, bw: parseInt(row.BW) || 0, zr: row.ZR ? parseInt(row.ZR) : undefined, zw: row.ZW ? parseInt(row.ZW) : undefined, totalMarks: parseFloat(row['Total MARKS']) || 0, marksPercentage: parseFloat(row['MARKS%']) || 0, wPercentage: parseFloat(row['W%']) || 0, percentile: parseFloat(row.PERCENTILE) || 0, batch, branch: (_j = row.BRANCH) === null || _j === void 0 ? void 0 : _j.trim(), uploadedBy: req.body.uploadedBy || 'admin', 
                    // New optional fields
                    testType,
                    examId }, (batchYear && { batchYear })), (batchCode && { batchCode })), (totalStudents && { totalStudents }));
                // Basic validation
                if (!resultData.course || !resultData.rollNo || !resultData.studentName) {
                    errors.push({
                        row: rowNumber,
                        error: 'Missing required fields: course, rollNo, or studentName'
                    });
                    return;
                }
                if (isNaN(resultData.rank) || isNaN(resultData.testDate.getTime())) {
                    errors.push({
                        row: rowNumber,
                        error: 'Invalid rank or test date'
                    });
                    return;
                }
                results.push(resultData);
            }
            catch (error) {
                errors.push({
                    row: rowNumber,
                    error: `Data parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`
                });
            }
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (errors.length > 0) {
                    return resolve((0, response_1.errorResponse)(res, 'CSV processing completed with errors', 400, {
                        errors,
                        processedRows: results.length
                    }));
                }
                if (results.length === 0) {
                    return resolve((0, response_1.errorResponse)(res, 'No valid data found in CSV', 400));
                }
                // Insert results in batches
                const batchSize = 100;
                let insertedCount = 0;
                for (let i = 0; i < results.length; i += batchSize) {
                    const batch = results.slice(i, i + batchSize);
                    yield Result_1.default.insertMany(batch, { ordered: false });
                    insertedCount += batch.length;
                }
                resolve((0, response_1.successResponse)(res, {
                    message: 'CSV uploaded successfully',
                    totalRows: rowNumber,
                    insertedCount,
                    results: results.slice(0, 5) // Return first 5 results as sample
                }));
            }
            catch (error) {
                reject(error);
            }
        }))
            .on('error', (error) => {
            reject(error);
        });
    });
}));
// Get result statistics
exports.getResultStats = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield Result_1.default.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                totalMarks: { $avg: '$totalMarks' },
                avgPercentage: { $avg: '$marksPercentage' },
                avgPercentile: { $avg: '$percentile' },
                courses: { $addToSet: '$course' },
                batches: { $addToSet: '$batch' },
                branches: { $addToSet: '$branch' }
            }
        }
    ]);
    const courseStats = yield Result_1.default.aggregate([
        {
            $group: {
                _id: '$course',
                count: { $sum: 1 },
                avgMarks: { $avg: '$totalMarks' },
                avgPercentage: { $avg: '$marksPercentage' }
            }
        },
        { $sort: { count: -1 } }
    ]);
    const batchStats = yield Result_1.default.aggregate([
        {
            $group: {
                _id: '$batch',
                count: { $sum: 1 },
                avgMarks: { $avg: '$totalMarks' },
                avgPercentage: { $avg: '$marksPercentage' }
            }
        },
        { $sort: { count: -1 } }
    ]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayResults = yield Result_1.default.countDocuments({
        createdAt: { $gte: today }
    });
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    const weekResults = yield Result_1.default.countDocuments({
        createdAt: { $gte: thisWeek }
    });
    (0, response_1.successResponse)(res, Object.assign(Object.assign({}, stats[0]), { courseStats,
        batchStats,
        todayResults,
        weekResults }));
}));
// Get results by course
exports.getResultsByCourse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course } = req.params;
    const { limit = 10, sortBy = 'rank', sortOrder = 'asc' } = req.query;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const results = yield Result_1.default.find({ course })
        .sort(sortOptions)
        .limit(Number(limit));
    (0, response_1.successResponse)(res, results);
}));
// Get results by batch
exports.getResultsByBatch = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { batch } = req.params;
    const { limit = 10, sortBy = 'rank', sortOrder = 'asc' } = req.query;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const results = yield Result_1.default.find({ batch })
        .sort(sortOptions)
        .limit(Number(limit));
    (0, response_1.successResponse)(res, results);
}));
// Get exam topper and student comparison data
exports.getExamComparison = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { examId } = req.params;
    const { rollNo } = req.query;
    if (!rollNo) {
        return (0, response_1.errorResponse)(res, 'Roll number is required', 400);
    }
    // Get the student's result for this exam
    const studentResult = yield Result_1.default.findById(examId);
    if (!studentResult) {
        return (0, response_1.errorResponse)(res, 'Exam result not found', 404);
    }
    // Verify the roll number matches
    if (studentResult.rollNo !== rollNo) {
        return (0, response_1.errorResponse)(res, 'Unauthorized access', 403);
    }
    // Get topper for the same exam (same testDate, course, batch)
    const topperResult = yield Result_1.default.findOne({
        testDate: studentResult.testDate,
        course: studentResult.course,
        batch: studentResult.batch,
        rank: 1
    });
    if (!topperResult) {
        return (0, response_1.errorResponse)(res, 'Topper data not found for this exam', 404);
    }
    // Calculate percentages
    const calculateAttemptPercent = (ta, tq) => (tq > 0 ? (ta / tq) * 100 : 0);
    const calculateRightsPercent = (tr, ta) => (ta > 0 ? (tr / ta) * 100 : 0);
    const calculateWrongPercent = (tw, ta) => (ta > 0 ? (tw / ta) * 100 : 0);
    const comparisonData = {
        examInfo: {
            examDate: studentResult.testDate,
            course: studentResult.course,
            testType: studentResult.course.toLowerCase().includes('surprise') ? 'SURPRISE TEST' : 'CLASSROOM TEST-MEDICAL'
        },
        student: {
            rollNo: studentResult.rollNo,
            studentName: studentResult.studentName,
            rank: studentResult.rank,
            marksPercent: studentResult.marksPercentage,
            attemptPercent: calculateAttemptPercent(studentResult.ta, studentResult.tq),
            rightsPercent: calculateRightsPercent(studentResult.tr, studentResult.ta),
            wrongPercent: calculateWrongPercent(studentResult.tw, studentResult.ta),
            percentile: studentResult.percentile
        },
        topper: {
            rollNo: topperResult.rollNo,
            studentName: topperResult.studentName,
            rank: topperResult.rank,
            marksPercent: topperResult.marksPercentage,
            attemptPercent: calculateAttemptPercent(topperResult.ta, topperResult.tq),
            rightsPercent: calculateRightsPercent(topperResult.tr, topperResult.ta),
            wrongPercent: calculateWrongPercent(topperResult.tw, topperResult.ta),
            percentile: topperResult.percentile
        }
    };
    (0, response_1.successResponse)(res, comparisonData);
}));
// Get results by roll number and batch (for student result page)
exports.getResultsByRollNo = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rollNo } = req.params;
    const { batch } = req.query;
    const query = { rollNo };
    if (batch) {
        query.batch = batch;
    }
    const results = yield Result_1.default.find(query)
        .sort({ testDate: -1 });
    if (results.length === 0) {
        return (0, response_1.errorResponse)(res, 'No results found for this roll number', 404);
    }
    // Get student info from first result
    const studentInfo = {
        rollNo: results[0].rollNo,
        studentName: results[0].studentName,
        course: results[0].course,
        branch: results[0].branch
    };
    // Group results by test type (CLASSROOM TEST or SURPRISE TEST based on course name or test date pattern)
    const classroomTests = results.filter(r => !r.course.toLowerCase().includes('surprise'));
    const surpriseTests = results.filter(r => r.course.toLowerCase().includes('surprise'));
    (0, response_1.successResponse)(res, {
        studentInfo,
        classroomTests,
        surpriseTests,
        allResults: results
    });
}));
//# sourceMappingURL=resultController.js.map