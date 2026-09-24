import express from 'express';
import HiringApplication from '../models/HiringApplication.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// POST /api/hiring
router.post('/', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const appData = { ...req.body };

    if (req.files?.resume?.[0]) {
      appData.resume = `/uploads/resumes/${req.files.resume[0].filename}`;
    }
    if (req.files?.profilePhoto?.[0]) {
      appData.profilePhoto = `/uploads/photos/${req.files.profilePhoto[0].filename}`;
    }

    const application = await HiringApplication.create(appData);
    res.status(201).json({
      success: true,
      applicationId: application.applicationId,
      message: 'Application submitted successfully! We will contact you soon.'
    });
  } catch (error) {
    console.error('Hiring error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application. Please try again.' });
  }
});

export default router;
