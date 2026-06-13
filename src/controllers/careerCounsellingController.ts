import { Request, Response } from 'express';
import CareerCounselling from '../models/CareerCounselling';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all career counselling requests
export const getAllCareerCounsellings = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { mobileNo: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { institute: { $regex: search, $options: 'i' } },
      { class: { $regex: search, $options: 'i' } }
    ];
  }

  const counsellings = await CareerCounselling.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await CareerCounselling.countDocuments(query);

  successResponse(res, {
    counsellings,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    total
  });
});

// Get single career counselling request
export const getCareerCounsellingById = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await CareerCounselling.findById(req.params.id);
  
  if (!counselling) {
    return errorResponse(res, 'Career counselling request not found', 404);
  }

  successResponse(res, counselling);
});

// Create new career counselling request
export const createCareerCounselling = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await CareerCounselling.create(req.body);
  successResponse(res, counselling, 'Career counselling request created successfully', 201);
});

// Update career counselling request
export const updateCareerCounselling = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await CareerCounselling.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!counselling) {
    return errorResponse(res, 'Career counselling request not found', 404);
  }

  successResponse(res, counselling, 'Career counselling request updated successfully');
});

// Delete career counselling request
export const deleteCareerCounselling = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await CareerCounselling.findByIdAndDelete(req.params.id);

  if (!counselling) {
    return errorResponse(res, 'Career counselling request not found', 404);
  }

  successResponse(res, null, 'Career counselling request deleted successfully');
});

// Get career counselling statistics
export const getCareerCounsellingStats = asyncHandler(async (req: Request, res: Response) => {
  const total = await CareerCounselling.countDocuments();
  const pending = await CareerCounselling.countDocuments({ status: 'pending' });
  const contacted = await CareerCounselling.countDocuments({ status: 'contacted' });
  const counselled = await CareerCounselling.countDocuments({ status: 'counselled' });
  const closed = await CareerCounselling.countDocuments({ status: 'closed' });

  // Count by exam preparation
  const examStats = await CareerCounselling.aggregate([
    {
      $group: {
        _id: '$examPreparation',
        count: { $sum: 1 }
      }
    }
  ]);

  // Count by city (top 10)
  const citiesStats = await CareerCounselling.aggregate([
    {
      $group: {
        _id: '$city',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  successResponse(res, {
    total,
    byStatus: { pending, contacted, counselled, closed },
    byExam: examStats,
    topCities: citiesStats
  });
});

// Download career counselling requests as CSV
export const downloadCareerCounsellingCSV = asyncHandler(async (req: Request, res: Response) => {
  const { status, search } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { mobileNo: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
      { institute: { $regex: search, $options: 'i' } },
      { class: { $regex: search, $options: 'i' } }
    ];
  }

  const counsellings = await CareerCounselling.find(query).sort({ createdAt: -1 });

  if (counsellings.length === 0) {
    return errorResponse(res, 'No records found', 404);
  }

  // Create CSV header
  const csvHeader = ['Student Name', 'Mobile No', 'Class', 'City', 'Institute', 'Exam Preparation', 'Status', 'Created At'];
  const csvRows = counsellings.map(item => [
    item.studentName,
    item.mobileNo,
    item.class,
    item.city,
    item.institute,
    item.examPreparation,
    item.status,
    new Date(item.createdAt).toLocaleDateString()
  ]);

  const csvContent = [
    csvHeader.join(','),
    ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=career-counselling.csv');
  res.send(csvContent);
});
