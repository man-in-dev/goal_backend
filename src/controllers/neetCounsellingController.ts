import { Request, Response } from 'express';
import NEETCounselling from '../models/NEETCounselling';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all NEET counselling requests
export const getAllNEETCounsellings = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search, category } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { mobileNo: { $regex: search, $options: 'i' } },
      { whatsappNo: { $regex: search, $options: 'i' } },
      { homeTown: { $regex: search, $options: 'i' } },
      { previousSchoolOrCoaching: { $regex: search, $options: 'i' } }
    ];
  }

  const counsellings = await NEETCounselling.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await NEETCounselling.countDocuments(query);

  successResponse(res, {
    counsellings,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    total
  });
});

// Get single NEET counselling request
export const getNEETCounsellingById = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await NEETCounselling.findById(req.params.id);
  
  if (!counselling) {
    return errorResponse(res, 'NEET counselling request not found', 404);
  }

  successResponse(res, counselling);
});

// Create new NEET counselling request
export const createNEETCounselling = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await NEETCounselling.create(req.body);
  successResponse(res, counselling, 'NEET counselling request created successfully', 201);
});

// Update NEET counselling request
export const updateNEETCounselling = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await NEETCounselling.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!counselling) {
    return errorResponse(res, 'NEET counselling request not found', 404);
  }

  successResponse(res, counselling, 'NEET counselling request updated successfully');
});

// Delete NEET counselling request
export const deleteNEETCounselling = asyncHandler(async (req: Request, res: Response) => {
  const counselling = await NEETCounselling.findByIdAndDelete(req.params.id);

  if (!counselling) {
    return errorResponse(res, 'NEET counselling request not found', 404);
  }

  successResponse(res, null, 'NEET counselling request deleted successfully');
});

// Get NEET counselling statistics
export const getNEETCounsellingStats = asyncHandler(async (req: Request, res: Response) => {
  const total = await NEETCounselling.countDocuments();
  const pending = await NEETCounselling.countDocuments({ status: 'pending' });
  const contacted = await NEETCounselling.countDocuments({ status: 'contacted' });
  const processed = await NEETCounselling.countDocuments({ status: 'processed' });
  const closed = await NEETCounselling.countDocuments({ status: 'closed' });

  // Count by category
  const categoryStats = await NEETCounselling.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  // Count by home town (top 10)
  const townStats = await NEETCounselling.aggregate([
    {
      $group: {
        _id: '$homeTown',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  successResponse(res, {
    total,
    byStatus: {
      pending,
      contacted,
      processed,
      closed
    },
    byCategory: categoryStats,
    topTowns: townStats
  });
});

// Download NEET counselling CSV
export const downloadNEETCounsellingCSV = asyncHandler(async (req: Request, res: Response) => {
  const { status, category } = req.query;
  
  const query: any = {};
  if (status) query.status = status;
  if (category) query.category = category;

  const counsellings = await NEETCounselling.find(query).sort({ createdAt: -1 });

  if (!counsellings || counsellings.length === 0) {
    return errorResponse(res, 'No data found to download', 404);
  }

  // Convert to CSV
  const headers = ['Name', 'Mobile No', 'WhatsApp No', 'Home Town', 'Previous School/Coaching', 'Status', 'Created Date'];
  const csvData = [
    headers.join(','),
    ...counsellings.map(c =>
      [
        `"${c.name}"`,
        c.mobileNo,
        c.whatsappNo,
        `"${c.homeTown}"`,
        `"${c.previousSchoolOrCoaching}"`,
        c.status,
        new Date(c.createdAt).toLocaleDateString('en-IN')
      ].join(',')
    )
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="neet-counselling-data.csv"');
  res.send(csvData);
});
