import express from 'express';
import Worker from '../models/Worker.js';
import Review from '../models/Review.js';
import { adminProtect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    const filter = { isActive: true };
    const workers = await Worker.find(filter)
      .populate('services', 'name category price')
      .sort('sortOrder');
    res.json({ success: true, workers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workers' });
  }
});

// GET /api/workers/:id
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('services', 'name category price duration');
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch worker' });
  }
});

// GET /api/workers/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.id, isVisible: true })
      .populate('user', 'fullName')
      .sort('-createdAt')
      .limit(20);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Admin: POST /api/workers
router.post('/', adminProtect, upload.single('photo'), async (req, res) => {
  try {
    const workerData = { ...req.body };
    if (req.file) workerData.photo = `/uploads/photos/${req.file.filename}`;
    if (typeof workerData.services === 'string') {
      workerData.services = JSON.parse(workerData.services);
    }
    if (typeof workerData.workingDays === 'string') {
      workerData.workingDays = JSON.parse(workerData.workingDays);
    }
    if (typeof workerData.workingHours === 'string') {
      workerData.workingHours = JSON.parse(workerData.workingHours);
    }
    if (typeof workerData.breakTime === 'string') {
      workerData.breakTime = JSON.parse(workerData.breakTime);
    }
    const worker = await Worker.create(workerData);
    res.status(201).json({ success: true, worker, message: 'Worker added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add worker' });
  }
});

// Admin: PUT /api/workers/:id
router.put('/:id', adminProtect, upload.single('photo'), async (req, res) => {
  try {
    const workerData = { ...req.body };
    if (req.file) workerData.photo = `/uploads/photos/${req.file.filename}`;
    if (typeof workerData.services === 'string') {
      workerData.services = JSON.parse(workerData.services);
    }
    if (typeof workerData.workingDays === 'string') {
      workerData.workingDays = JSON.parse(workerData.workingDays);
    }
    if (typeof workerData.workingHours === 'string') {
      workerData.workingHours = JSON.parse(workerData.workingHours);
    }
    if (typeof workerData.breakTime === 'string') {
      workerData.breakTime = JSON.parse(workerData.breakTime);
    }
    const worker = await Worker.findByIdAndUpdate(req.params.id, workerData, { new: true, runValidators: true });
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, worker, message: 'Worker updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update worker' });
  }
});

// Admin: DELETE /api/workers/:id
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    if (!worker) return res.status(404).json({ success: false, message: 'Worker not found' });
    res.json({ success: true, message: 'Worker deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete worker' });
  }
});

export default router;
