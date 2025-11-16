import { Router } from 'express';
import authRoutes from './auth';
import admissionRoutes from './admission';
import contactRoutes from './contact';
import enquiryRoutes from './enquiry';
import complaintFeedbackRoutes from './complaintFeedback';
import bannerRoutes from './banner';
import newsEventRoutes from './newsEvent';
import blogRoutes from './blog';
import publicNoticeRoutes from './publicNotice';
import resultRoutes from './result';
import careerApplicationRoutes from './careerApplication';
import gvetRoutes from './gvet';
import gaetResultRoutes from './gaetResult';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/admission', admissionRoutes);
router.use('/contact', contactRoutes);
router.use('/enquiry', enquiryRoutes);
router.use('/complaint-feedback', complaintFeedbackRoutes);
router.use('/banner', bannerRoutes);
router.use('/news-events', newsEventRoutes);
router.use('/blog', blogRoutes);
router.use('/public-notice', publicNoticeRoutes);
router.use('/result', resultRoutes);
router.use('/career-applications', careerApplicationRoutes);
router.use('/gvet', gvetRoutes);
router.use('/gaet-results', gaetResultRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router; 