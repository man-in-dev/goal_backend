import { Response, NextFunction } from 'express';
import Course from '../models/Course';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse, errorResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { category, isActive } = req.query;

  // Build query
  const query: any = {};
  if (category) {
    query.category = category;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const courses = await Course.find(query).sort({ category: 1, order: 1 });

  return successResponse(res, { courses }, 'Courses fetched successfully');
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const course = await Course.findById(req.params.id).lean();

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  return successResponse(res, { course }, 'Course fetched successfully');
});

// @desc    Get course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
export const getCourseBySlug = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const course = await Course.findOne({ slug: req.params.slug, isActive: true }).lean();

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  return successResponse(res, { course }, 'Course fetched successfully');
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
export const createCourse = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, category, icon, order, isActive } = req.body;

  // Check if course with same title exists
  const existingCourse = await Course.findOne({ title });
  if (existingCourse) {
    return errorResponse(res, 'Course with this title already exists', 400);
  }

  const course = await Course.create({
    title,
    description,
    category,
    icon,
    order: order || 0,
    isActive: isActive !== undefined ? isActive : true,
  });

  return successResponse(res, { course }, 'Course created successfully', 201);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
export const updateCourse = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { title, description, category, icon, order, isActive } = req.body;

  let course = await Course.findById(req.params.id);

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  // Check if title is being changed and if it conflicts with another course
  if (title && title !== course.title) {
    const existingCourse = await Course.findOne({ title, _id: { $ne: req.params.id } });
    if (existingCourse) {
      return errorResponse(res, 'Course with this title already exists', 400);
    }
  }

  // Update fields
  if (title) course.title = title;
  if (description) course.description = description;
  if (category) course.category = category;
  if (icon !== undefined) course.icon = icon;
  if (order !== undefined) course.order = order;
  if (isActive !== undefined) course.isActive = isActive;

  // Regenerate slug if title changed
  if (title && title !== course.title) {
    course.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  await course.save();

  return successResponse(res, { course }, 'Course updated successfully');
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return errorResponse(res, 'Course not found', 404);
  }

  return successResponse(res, null, 'Course deleted successfully');
});

