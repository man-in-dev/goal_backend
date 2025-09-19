import { Request, Response } from 'express';
import EnquiryForm from '../models/EnquiryForm';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all enquiry forms
export const getAllEnquiries = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
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

  const enquiries = await EnquiryForm.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await EnquiryForm.countDocuments(query);

  successResponse(res, {
    enquiries,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    total
  });
});

// Get single enquiry form
export const getEnquiryById = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await EnquiryForm.findById(req.params.id);
  
  if (!enquiry) {
    return errorResponse(res, 'Enquiry form not found', 404);
  }

  successResponse(res, enquiry);
});

// Create new enquiry form
export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await EnquiryForm.create(req.body);
  successResponse(res, enquiry, 'Enquiry form created successfully', 201);
});

// Update enquiry form
export const updateEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await EnquiryForm.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!enquiry) {
    return errorResponse(res, 'Enquiry form not found', 404);
  }

  successResponse(res, enquiry, 'Enquiry form updated successfully');
});

// Delete enquiry form
export const deleteEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const enquiry = await EnquiryForm.findByIdAndDelete(req.params.id);

  if (!enquiry) {
    return errorResponse(res, 'Enquiry form not found', 404);
  }

  successResponse(res, null, 'Enquiry form deleted successfully');
});

// Get enquiry statistics
export const getEnquiryStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await EnquiryForm.aggregate([
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
  
  const todayEnquiries = await EnquiryForm.countDocuments({
    createdAt: { $gte: today }
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const weekEnquiries = await EnquiryForm.countDocuments({
    createdAt: { $gte: thisWeek }
  });

  successResponse(res, {
    ...stats[0],
    todayEnquiries,
    weekEnquiries
  });
});
