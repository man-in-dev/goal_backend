import { Request, Response } from 'express';
import { ApiResponse } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import GVETAnswerKey from '../models/GVETAnswerKey';

// @desc    Submit GVET answer key suggestion
// @route   POST /api/gvet/answer-key
// @access  Public
export const submitAnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { name, rollNo, phone, questionNo, explanation } = req.body as {
    name: string; rollNo: string; phone: string; questionNo: string; explanation: string;
  };

  const doc = await GVETAnswerKey.create({ name, rollNo, phone, questionNo, explanation });

  return ApiResponse.success(res, {
    message: 'Answer key suggestion submitted successfully',
    data: { id: doc._id }
  });
});

// @desc    Get GVET answer key submissions (admin)
// @route   GET /api/gvet/answer-key
// @access  Private (Admin)
export const getAnswerKeys = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '20', 10);
  const search = (req.query.search as string) || '';

  const query: any = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { rollNo: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { questionNo: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await GVETAnswerKey.countDocuments(query);
  const data = await GVETAnswerKey.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  return ApiResponse.success(res, {
    message: 'GVET submissions fetched',
    data: {
      submissions: data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  });
});

// @desc    Delete GVET answer key submission (admin)
// @route   DELETE /api/gvet/answer-key/:id
// @access  Private (Admin)
export const deleteAnswerKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await GVETAnswerKey.findByIdAndDelete(id);
  return ApiResponse.success(res, { message: 'Submission deleted' });
});


