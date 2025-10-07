import { Request, Response } from 'express';
import ComplaintFeedback from '../models/ComplaintFeedback';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';

// Get all complaints and feedback
export const getAllComplaintsFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, type, search } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (type) query.type = type;
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

  const complaintsFeedback = await ComplaintFeedback.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit) * 1)
    .skip((Number(page) - 1) * Number(limit));

  const total = await ComplaintFeedback.countDocuments(query);

  successResponse(res, {
    complaintsFeedback,
    totalPages: Math.ceil(total / Number(limit)),
    currentPage: Number(page),
    total
  });
});

// Get single complaint/feedback
export const getComplaintFeedbackById = asyncHandler(async (req: Request, res: Response) => {
  const complaintFeedback = await ComplaintFeedback.findById(req.params.id);
  
  if (!complaintFeedback) {
    return errorResponse(res, 'Complaint/Feedback not found', 404);
  }

  successResponse(res, complaintFeedback);
});

// Create new complaint/feedback
export const createComplaintFeedback = asyncHandler(async (req: Request, res: Response) => {
  const complaintFeedback = await ComplaintFeedback.create(req.body);
  successResponse(res, complaintFeedback, 'Complaint/Feedback submitted successfully', 201);
});

// Update complaint/feedback
export const updateComplaintFeedback = asyncHandler(async (req: Request, res: Response) => {
  const complaintFeedback = await ComplaintFeedback.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!complaintFeedback) {
    return errorResponse(res, 'Complaint/Feedback not found', 404);
  }

  successResponse(res, complaintFeedback, 'Complaint/Feedback updated successfully');
});

// Delete complaint/feedback
export const deleteComplaintFeedback = asyncHandler(async (req: Request, res: Response) => {
  const complaintFeedback = await ComplaintFeedback.findByIdAndDelete(req.params.id);

  if (!complaintFeedback) {
    return errorResponse(res, 'Complaint/Feedback not found', 404);
  }

  successResponse(res, null, 'Complaint/Feedback deleted successfully');
});

// Get complaint/feedback statistics
export const getComplaintFeedbackStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await ComplaintFeedback.aggregate([
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
  
  const todayComplaints = await ComplaintFeedback.countDocuments({
    createdAt: { $gte: today }
  });

  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  
  const weekComplaints = await ComplaintFeedback.countDocuments({
    createdAt: { $gte: thisWeek }
  });

  successResponse(res, {
    ...stats[0],
    todayComplaints,
    weekComplaints
  });
});

// Download complaints and feedback as CSV
export const downloadComplaintsFeedbackCSV = asyncHandler(async (req: Request, res: Response) => {
  const { status, type, search } = req.query;
  
  const query: any = {};
  
  if (status) query.status = status;
  if (type) query.type = type;
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

  const complaintsFeedback = await ComplaintFeedback.find(query).sort({ createdAt: -1 });

  // CSV headers
  const headers = [
    'ID',
    'Is Goal Student',
    'UID',
    'Roll Number',
    'Name',
    'Course',
    'Phone',
    'Email',
    'Type',
    'Department',
    'Message',
    'Attachment',
    'Attachment Alt',
    'Status',
    'Created At',
    'Updated At'
  ];

  // Convert data to CSV format
  const csvData = complaintsFeedback.map(item => [
    item._id,
    item.isGoalStudent ? 'Yes' : 'No',
    item.uid || '',
    item.rollNo || '',
    item.name || '',
    item.course || '',
    item.phone || '',
    item.email || '',
    item.type || '',
    item.department || '',
    item.message || '',
    item.attachment || '',
    item.attachmentAlt || '',
    item.status || '',
    item.createdAt ? new Date(item.createdAt).toISOString() : '',
    item.updatedAt ? new Date(item.updatedAt).toISOString() : ''
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...csvData.map(row => 
      row.map(field => 
        typeof field === 'string' && field.includes(',') 
          ? `"${field.replace(/"/g, '""')}"` 
          : field
      ).join(',')
    )
  ].join('\n');

  // Set response headers for CSV download
  const filename = `complaints_feedback_${new Date().toISOString().split('T')[0]}.csv`;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Cache-Control', 'no-cache');
  
  res.send(csvContent);
});