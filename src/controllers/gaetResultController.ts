import { Request, Response } from 'express';
import GAETResult from '../models/GAETResult';
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

// Get all GAET results
export const getAllGAETResults = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    search,
    testName,
    testCenter,
    sortBy = 'testDate',
    sortOrder = 'desc'
  } = req.query;
  
  const query: any = {};
  
  if (testName) query.testName = testName;
  if (testCenter) query.testCenter = testCenter;
  
  // Search functionality
  if (search) {
    query.$or = [
      { rollNo: { $regex: search, $options: 'i' } },
      { studentName: { $regex: search, $options: 'i' } },
      { testName: { $regex: search, $options: 'i' } },
      { testCenter: { $regex: search, $options: 'i' } }
    ];
  }
  
  const sort: any = {};
  sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;
  
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const limitNum = parseInt(limit as string);
  
  const results = await GAETResult.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum);
  
  const total = await GAETResult.countDocuments(query);
  
  return successResponse(res, {
    results,
    pagination: {
      page: parseInt(page as string),
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    }
  });
});

// Get GAET result for a student (public-friendly helper)
// This is intended to be used by the frontend result pages where
// students enter their roll number to view their score/fee details.
export const getGAETResultByRollNo = asyncHandler(async (req: Request, res: Response) => {
  const { rollNo } = req.params;
  const { testName } = req.query as { testName?: string };

  if (!rollNo) {
    return errorResponse(res, 'Roll number is required', 400);
  }

  const query: any = { rollNo };
  if (testName) {
    query.testName = testName;
  }

  // Get the most recent record for this roll number (optionally for a specific test)
  const result = await GAETResult.findOne(query).sort({ testDate: -1, createdAt: -1 });

  if (!result) {
    return errorResponse(res, 'Result not found for this roll number', 404);
  }

  return successResponse(res, result);
});

// Get GAET result by ID
export const getGAETResultById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await GAETResult.findById(id);
  
  if (!result) {
    return errorResponse(res, 'GAET result not found', 404);
  }
  
  return successResponse(res, result);
});

// Create new GAET result
export const createGAETResult = asyncHandler(async (req: Request, res: Response) => {
  const result = await GAETResult.create(req.body);
  
  return successResponse(res, result, 'GAET result created successfully', 201);
});

// Update GAET result
export const updateGAETResult = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await GAETResult.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!result) {
    return errorResponse(res, 'GAET result not found', 404);
  }
  
  return successResponse(res, result, 'GAET result updated successfully');
});

// Delete GAET result
export const deleteGAETResult = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await GAETResult.findByIdAndDelete(id);
  
  if (!result) {
    return errorResponse(res, 'GAET result not found', 404);
  }
  
  return successResponse(res, null, 'GAET result deleted successfully');
});

// Delete multiple GAET results
export const deleteMultipleGAETResults = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return errorResponse(res, 'Please provide an array of IDs to delete', 400);
  }
  
  const result = await GAETResult.deleteMany({ _id: { $in: ids } });
  
  return successResponse(res, {
    deletedCount: result.deletedCount
  }, `${result.deletedCount} GAET results deleted successfully`);
});

// Upload CSV GAET results
export const uploadCSVGAETResults = asyncHandler(async (req: Request, res: Response) => {
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
          // Parse and validate the data
          const resultData: any = {
            rollNo: row['ROLL NO']?.toString().trim() || '',
            studentName: row['STUDENT NAME']?.toString().trim() || '',
            testName: row['TEST NAME']?.toString().trim() || '',
            tq: parseInt(row['TQ']?.toString() || '0') || 0,
            tr: parseInt(row['TR']?.toString() || '0') || 0,
            tw: parseInt(row['TW']?.toString() || '0') || 0,
            tl: parseInt(row['TL']?.toString() || '0') || 0,
            pr: parseInt(row['PR']?.toString() || '0') || 0,
            pw: parseInt(row['PW']?.toString() || '0') || 0,
            cr: parseInt(row['CR']?.toString() || '0') || 0,
            cw: parseInt(row['CW']?.toString() || '0') || 0,
            mr: parseInt(row['MR']?.toString() || '0') || 0,
            mw: parseInt(row['MW']?.toString() || '0') || 0,
            br: parseInt(row['BR']?.toString() || '0') || 0,
            bw: parseInt(row['BW']?.toString() || '0') || 0,
            gkr: parseInt(row['GKR']?.toString() || '0') || 0,
            gkw: parseInt(row['GKW']?.toString() || '0') || 0,
            totalMarks: parseFloat(row['T MARKS']?.toString() || '0') || 0,
            marksPercentage: parseFloat(row['MARKS%']?.toString() || '0') || 0,
            scholarship: row['SCH']?.toString().trim() || undefined,
            specialDiscount: row['SPL DISC']?.toString().trim() || undefined,
            totalFeeOneTime: row['TOTAL FEE(ONE TIME)'] ? parseFloat(row['TOTAL FEE(ONE TIME)']?.toString() || '0') : undefined,
            // Note: If CSV has duplicate "SCH AMOUNT" columns, csv-parser will only keep the last value
            // The first SCH AMOUNT is for one-time payment, second is for installment
            // We'll use the value for one-time, and try to get installment from a separate column if it exists
            scholarshipAmount: row['SCH AMOUNT'] ? parseFloat(row['SCH AMOUNT']?.toString() || '0') : undefined,
            totalFeeInstallment: row['TOTAL FEE (INS)'] ? parseFloat(row['TOTAL FEE (INS)']?.toString() || '0') : undefined,
            // For installment scholarship amount, if CSV has duplicate columns, this might be the same as scholarshipAmount
            // In that case, you may need to manually adjust or use a different CSV structure
            scholarshipAmountInstallment: row['SCH AMOUNT (INS)'] ? parseFloat(row['SCH AMOUNT (INS)']?.toString() || '0') : 
              (row['SCH AMOUNT'] ? parseFloat(row['SCH AMOUNT']?.toString() || '0') : undefined),
            testDate: row['TEST DATE']?.toString().trim() || '',
            testCenter: row['TEST CENTER']?.toString().trim() || undefined,
            remarks: row['REMARKS']?.toString().trim() || undefined,
          };

          // Basic validation
          if (!resultData.rollNo || !resultData.studentName || !resultData.testName) {
            errors.push({
              row: rowNumber,
              error: 'Missing required fields: rollNo, studentName, or testName'
            });
            return;
          }

          if (!resultData.testDate) {
            errors.push({
              row: rowNumber,
              error: 'Missing required field: testDate'
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
            await GAETResult.insertMany(batch, { ordered: false });
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

// Get GAET result statistics
export const getGAETResultStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await GAETResult.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        totalMarks: { $avg: '$totalMarks' },
        avgPercentage: { $avg: '$marksPercentage' },
        uniqueTests: { $addToSet: '$testName' },
        uniqueCenters: { $addToSet: '$testCenter' },
        uniqueStudents: { $addToSet: '$rollNo' }
      }
    },
    {
      $project: {
        _id: 0,
        total: 1,
        totalMarks: { $round: ['$totalMarks', 2] },
        avgPercentage: { $round: ['$avgPercentage', 2] },
        uniqueTestsCount: { $size: '$uniqueTests' },
        uniqueCentersCount: { $size: { $filter: { input: '$uniqueCenters', as: 'center', cond: { $ne: ['$$center', null] } } } },
        uniqueStudentsCount: { $size: '$uniqueStudents' },
        uniqueTests: 1,
        uniqueCenters: 1
      }
    }
  ]);

  // Get today's results count
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayResults = await GAETResult.countDocuments({
    createdAt: { $gte: today }
  });

  const result = stats[0] || {
    total: 0,
    totalMarks: 0,
    avgPercentage: 0,
    uniqueTestsCount: 0,
    uniqueCentersCount: 0,
    uniqueStudentsCount: 0,
    uniqueTests: [],
    uniqueCenters: []
  };

  return successResponse(res, {
    ...result,
    todayResults
  });
});

// Export multer configuration
export { upload };

