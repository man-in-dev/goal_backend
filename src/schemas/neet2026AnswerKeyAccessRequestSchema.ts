import { z } from 'zod';

export const neet2026AnswerKeyAccessRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  mobileNo: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  whatsappNo: z.string().regex(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits'),
  deviceId: z.string().min(1, 'Device ID is required'),
  userAgent: z.string().optional(),
});
