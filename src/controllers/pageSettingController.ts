import { Request, Response } from 'express';
import PageSetting from '../models/PageSetting';

export const getSettingsByPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page } = req.params;
    const settings = await PageSetting.find({ page });
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching page settings:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, key } = req.params;
    const { value } = req.body;
    
    if (!value && value !== '') {
       res.status(400).json({ success: false, error: 'Value is required' });
       return;
    }

    const setting = await PageSetting.findOneAndUpdate(
      { page, key },
      { value },
      { new: true, upsert: true }
    );
    
    res.json({ success: true, data: setting });
  } catch (error) {
    console.error('Error updating page setting:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

export const getAllSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const settings = await PageSetting.find({});
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching all page settings:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
