"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complaintCSVQuerySchema = exports.enquiryCSVQuerySchema = exports.complaintQuerySchema = exports.enquiryQuerySchema = exports.complaintTypeFilterSchema = exports.complaintStatusFilterSchema = exports.enquiryStatusFilterSchema = exports.searchSchema = exports.paginationSchema = exports.objectIdSchema = void 0;
const zod_1 = require("zod");
// Common validation schemas that can be reused across different forms
// ObjectId validation
exports.objectIdSchema = zod_1.z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
// Pagination schema
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number()
        .int('Page must be an integer')
        .min(1, 'Page must be at least 1')
        .default(1),
    limit: zod_1.z.coerce.number()
        .int('Limit must be an integer')
        .min(1, 'Limit must be at least 1')
        .max(100, 'Limit cannot exceed 100')
        .default(10)
});
// Search schema
exports.searchSchema = zod_1.z.object({
    search: zod_1.z.string()
        .max(100, 'Search term cannot exceed 100 characters')
        .trim()
        .optional()
});
// Status filter schema for enquiries
exports.enquiryStatusFilterSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'contacted', 'resolved', 'closed'])
        .optional()
});
// Status filter schema for complaints/feedback
exports.complaintStatusFilterSchema = zod_1.z.object({
    status: zod_1.z.enum(['pending', 'in_review', 'resolved', 'closed'])
        .optional()
});
// Type filter schema for complaints/feedback
exports.complaintTypeFilterSchema = zod_1.z.object({
    type: zod_1.z.enum(['complaint', 'feedback', 'suggestion'])
        .optional()
});
// Combined query schemas
exports.enquiryQuerySchema = exports.paginationSchema
    .merge(exports.searchSchema)
    .merge(exports.enquiryStatusFilterSchema);
exports.complaintQuerySchema = exports.paginationSchema
    .merge(exports.searchSchema)
    .merge(exports.complaintStatusFilterSchema)
    .merge(exports.complaintTypeFilterSchema);
// CSV download query schemas
exports.enquiryCSVQuerySchema = exports.searchSchema.merge(exports.enquiryStatusFilterSchema);
exports.complaintCSVQuerySchema = exports.searchSchema
    .merge(exports.complaintStatusFilterSchema)
    .merge(exports.complaintTypeFilterSchema);
//# sourceMappingURL=commonSchemas.js.map