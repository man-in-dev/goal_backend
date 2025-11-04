import { Request, Response } from 'express';
import Result from '../models/Result';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';

// Configure multer for CSV file upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all results
export const getAllResults = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    course, 
    batch, 
    branch, 
    testDate, 
    search,
    testType,
    batchYear,
    batchCode,
    sortBy = 'testDate',
    sortOrder = 'desc'
  } = req.query;
  
  const query: any = {};
  
  if (course) query.course = course;
  if (batch) query.batch = batch;
  if (branch) query.branch = branch;
  if (testType) query.testType = testType;
  if (batchYear) query.batchYear = parseInt(batchYear as string);
  if (batchCode) query.batchCode = batchCode;
  if (testDate) {
    const date = new Date(testDate as string);
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

  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  const results = await Result.find(query)
    .sort(sortOptions)
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await Result.countDocuments(query);

  successResponse(res, {
    results,
    pagination: {
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total,
      limit: Number(limit)
    }
  });
});

// Get single result (by rollNo and batch)
export const getResultById = asyncHandler(async (req: Request, res: Response) => {
  const { rollNo, batch } = req.params;

  console.log('Searching for results:', { rollNo, batch });

  // Try multiple batch formats to match the database
  let query: any = { rollNo };
  
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
  
  let results = await Result.find(query).sort({ testDate: -1 });
  console.log(`Found ${results.length} results with batch filter`);
  
  // If no results found with batch, try without batch filter
  if (results.length === 0 && batch && batch !== 'default') {
    console.log('No results with batch, trying without batch filter');
    query = { rollNo };
    results = await Result.find(query).sort({ testDate: -1 });
    console.log(`Found ${results.length} results without batch filter`);
    
    // Log unique batch values for this rollNo to help debug
    if (results.length > 0) {
      const uniqueBatches = [...new Set(results.map(r => r.batch))];
      console.log('Available batch values for this rollNo:', uniqueBatches);
    }
  }
  
  if (!results || results.length === 0) {
    return errorResponse(res, 'No results found for this roll number', 404);
  }

  // Get student info from first result
  const studentInfo = {
    rollNo: results[0].rollNo,
    studentName: results[0].studentName,
    course: results[0].course,
    branch: results[0].branch
  };

  // Group results by test type (CLASSROOM TEST or SURPRISE TEST based on course name)
  const classroomTests = results.filter(r => 
    !r.course.toLowerCase().includes('surprise')
  );
  const surpriseTests = results.filter(r => 
    r.course.toLowerCase().includes('surprise')
  );

  successResponse(res, {
    studentInfo,
    classroomTests,
    surpriseTests,
    allResults: results
  });
});

// Create new result
export const createResult = asyncHandler(async (req: Request, res: Response) => {
  const result = await Result.create(req.body);
  successResponse(res, result, 'Result created successfully', 201);
});

// Update result
export const updateResult = asyncHandler(async (req: Request, res: Response) => {
  const result = await Result.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!result) {
    return errorResponse(res, 'Result not found', 404);
  }

  successResponse(res, result, 'Result updated successfully');
});

// Delete result
export const deleteResult = asyncHandler(async (req: Request, res: Response) => {
  const result = await Result.findByIdAndDelete(req.params.id);

  if (!result) {
    return errorResponse(res, 'Result not found', 404);
  }

  successResponse(res, null, 'Result deleted successfully');
});

// Delete multiple results
export const deleteMultipleResults = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return errorResponse(res, 'Result IDs are required', 400);
  }

  const result = await Result.deleteMany({ _id: { $in: ids } });
  
  successResponse(res, { deletedCount: result.deletedCount }, `${result.deletedCount} results deleted successfully`);
});

// Upload CSV results
export const uploadCSVResults = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return errorResponse(res, 'CSV file is required', 400);
  }

  const results: any[] = [];
  const errors: any[] = [];
  let rowNumber = 0;

  return new Promise((resolve, reject) => {
    if (!req.file) {
      return resolve(errorResponse(res, 'No file uploaded', 400));
    }
    
    const stream = Readable.from(req.file.buffer.toString());
    
    stream
      .pipe(csv())
      .on('data', (row) => {
        rowNumber++;
        
        try {
          // Validate and transform the data
          const course = row.COURSE?.trim();
          const batch = row.BATCH?.trim();
          const testDate = new Date(row['TEST DATE']);
          
          // Generate new fields if not provided
          const testType = row['TEST TYPE']?.trim() || 
            (course?.toLowerCase().includes('surprise') ? 'SURPRISE_TEST' : 'CLASSROOM_TEST');
          
          const examId = row['EXAM ID']?.trim() || 
            `${testType === 'SURPRISE_TEST' ? 'ST' : 'CT'}-${testDate.toISOString().split('T')[0]}-${batch?.replace(/\s+/g, '-')}`;
          
          const batchYear = row['BATCH YEAR'] ? parseInt(row['BATCH YEAR']) : 
            (batch ? parseInt(batch.match(/\d{4}/)?.[0] || new Date().getFullYear().toString()) : undefined);
          
          const batchCode = row['BATCH CODE']?.trim() || batch;
          
          const totalStudents = row['TOTAL STUDENTS'] ? parseInt(row['TOTAL STUDENTS']) : undefined;

          const resultData: any = {
            course,
            testDate,
            rank: parseInt(row.RANK),
            rollNo: row['ROLL NO']?.trim(),
            studentName: row['STUDENT NAME']?.trim(),
            tq: parseInt(row.TQ) || 0,
            ta: parseInt(row.TA) || 0,
            tr: parseInt(row.TR) || 0,
            tw: parseInt(row.TW) || 0,
            tl: parseInt(row.TL) || 0,
            pr: parseInt(row.PR) || 0,
            pw: parseInt(row.PW) || 0,
            cr: parseInt(row.CR) || 0,
            cw: parseInt(row.CW) || 0,
            br: parseInt(row.BR) || 0,
            bw: parseInt(row.BW) || 0,
            zr: row.ZR ? parseInt(row.ZR) : undefined,
            zw: row.ZW ? parseInt(row.ZW) : undefined,
            totalMarks: parseFloat(row['Total MARKS']) || 0,
            marksPercentage: parseFloat(row['MARKS%']) || 0,
            wPercentage: parseFloat(row['W%']) || 0,
            percentile: parseFloat(row.PERCENTILE) || 0,
            batch,
            branch: row.BRANCH?.trim(),
            uploadedBy: req.body.uploadedBy || 'admin',
            // New optional fields
            testType,
            examId,
            ...(batchYear && { batchYear }),
            ...(batchCode && { batchCode }),
            ...(totalStudents && { totalStudents })
          };

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
        } catch (error) {
          errors.push({
            row: rowNumber,
            error: `Data parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      })
      .on('end', async () => {
        try {
          if (errors.length > 0) {
            return resolve(errorResponse(res, 'CSV processing completed with errors', 400, {
              errors,
              processedRows: results.length
            }));
          }

          if (results.length === 0) {
            return resolve(errorResponse(res, 'No valid data found in CSV', 400));
          }

          // Insert results in batches
          const batchSize = 100;
          let insertedCount = 0;
          
          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            await Result.insertMany(batch, { ordered: false });
            insertedCount += batch.length;
          }

          resolve(successResponse(res, {
            message: 'CSV uploaded successfully',
            totalRows: rowNumber,
            insertedCount,
            results: results.slice(0, 5) // Return first 5 results as sample
          }));
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
});

// Get result statistics
export const getResultStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Result.aggregate([
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

  const courseStats = await Result.aggregate([
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

  const batchStats = await Result.aggregate([
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
  
  const todayResults = await Result.countDocuments({
    createdAt: { $gte: today }
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const weekResults = await Result.countDocuments({
    createdAt: { $gte: thisWeek }
  });

  successResponse(res, {
    ...stats[0],
    courseStats,
    batchStats,
    todayResults,
    weekResults
  });
});

// Get results by course
export const getResultsByCourse = asyncHandler(async (req: Request, res: Response) => {
  const { course } = req.params;
  const { limit = 10, sortBy = 'rank', sortOrder = 'asc' } = req.query;

  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  const results = await Result.find({ course })
    .sort(sortOptions)
    .limit(Number(limit));

  successResponse(res, results);
});

// Get results by batch
export const getResultsByBatch = asyncHandler(async (req: Request, res: Response) => {
  const { batch } = req.params;
  const { limit = 10, sortBy = 'rank', sortOrder = 'asc' } = req.query;

  const sortOptions: any = {};
  sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

  const results = await Result.find({ batch })
    .sort(sortOptions)
    .limit(Number(limit));

  successResponse(res, results);
});

// Get exam topper and student comparison data
export const getExamComparison = asyncHandler(async (req: Request, res: Response) => {
  const { examId } = req.params;
  const { rollNo } = req.query;

  if (!rollNo) {
    return errorResponse(res, 'Roll number is required', 400);
  }

  // Get the student's result for this exam
  const studentResult = await Result.findById(examId);
  if (!studentResult) {
    return errorResponse(res, 'Exam result not found', 404);
  }

  // Verify the roll number matches
  if (studentResult.rollNo !== rollNo) {
    return errorResponse(res, 'Unauthorized access', 403);
  }

  // Get topper for the same exam (same testDate, course, batch)
  const topperResult = await Result.findOne({
    testDate: studentResult.testDate,
    course: studentResult.course,
    batch: studentResult.batch,
    rank: 1
  });

  if (!topperResult) {
    return errorResponse(res, 'Topper data not found for this exam', 404);
  }

  // Calculate percentages
  const calculateAttemptPercent = (ta: number, tq: number) => (tq > 0 ? (ta / tq) * 100 : 0);
  const calculateRightsPercent = (tr: number, ta: number) => (ta > 0 ? (tr / ta) * 100 : 0);
  const calculateWrongPercent = (tw: number, ta: number) => (ta > 0 ? (tw / ta) * 100 : 0);

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

  successResponse(res, comparisonData);
});

// Get results by roll number and batch (for student result page)
export const getResultsByRollNo = asyncHandler(async (req: Request, res: Response) => {
  const { rollNo } = req.params;
  const { batch } = req.query;

  const query: any = { rollNo };
  if (batch) {
    query.batch = batch;
  }

  const results = await Result.find(query)
    .sort({ testDate: -1 });

  if (results.length === 0) {
    return errorResponse(res, 'No results found for this roll number', 404);
  }

  // Get student info from first result
  const studentInfo = {
    rollNo: results[0].rollNo,
    studentName: results[0].studentName,
    course: results[0].course,
    branch: results[0].branch
  };

  // Group results by test type (CLASSROOM TEST or SURPRISE TEST based on course name or test date pattern)
  const classroomTests = results.filter(r => 
    !r.course.toLowerCase().includes('surprise')
  );
  const surpriseTests = results.filter(r => 
    r.course.toLowerCase().includes('surprise')
  );

  successResponse(res, {
    studentInfo,
    classroomTests,
    surpriseTests,
    allResults: results
  });
});

// Export multer configuration
export { upload };
