import { z } from 'zod';

// Common validation schemas that can be reused across different forms

// ObjectId validation
export const objectIdSchema = z.string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  
  limit: z.coerce.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10)
});

// Search schema
export const searchSchema = z.object({
  search: z.string()
    .max(100, 'Search term cannot exceed 100 characters')
    .trim()
    .optional()
});

// Status filter schema for enquiries
export const enquiryStatusFilterSchema = z.object({
  status: z.enum(['pending', 'contacted', 'resolved', 'closed'])
    .optional()
});

// Status filter schema for complaints/feedback
export const complaintStatusFilterSchema = z.object({
  status: z.enum(['pending', 'in_review', 'resolved', 'closed'])
    .optional()
});

// Type filter schema for complaints/feedback
export const complaintTypeFilterSchema = z.object({
  type: z.enum(['complaint', 'feedback', 'suggestion'])
    .optional()
});

// Combined query schemas
export const enquiryQuerySchema = paginationSchema
  .merge(searchSchema)
  .merge(enquiryStatusFilterSchema);

export const complaintQuerySchema = paginationSchema
  .merge(searchSchema)
  .merge(complaintStatusFilterSchema)
  .merge(complaintTypeFilterSchema);

// CSV download query schemas
export const enquiryCSVQuerySchema = searchSchema.merge(enquiryStatusFilterSchema);
export const complaintCSVQuerySchema = searchSchema
  .merge(complaintStatusFilterSchema)
  .merge(complaintTypeFilterSchema);

// Type inference
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type EnquiryQueryInput = z.infer<typeof enquiryQuerySchema>;
export type ComplaintQueryInput = z.infer<typeof complaintQuerySchema>;
export type EnquiryCSVQueryInput = z.infer<typeof enquiryCSVQuerySchema>;
export type ComplaintCSVQueryInput = z.infer<typeof complaintCSVQuerySchema>;
