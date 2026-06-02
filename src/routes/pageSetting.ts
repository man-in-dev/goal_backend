import express from 'express';
import { getSettingsByPage, updateSetting, getAllSettings } from '../controllers/pageSettingController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllSettings);
router.get('/:page', getSettingsByPage);
router.put('/:page/:key', protect, authorize('admin', 'super_admin'), updateSetting);

export default router;
