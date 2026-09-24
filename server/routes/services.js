import express from 'express';
import Service from '../models/Service.js';
import { adminProtect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const services = await Service.find(filter)
      .populate('availableWorkers', 'name role photo')
      .sort('sortOrder');
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('availableWorkers', 'name role photo rating');
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service' });
  }
});

// Admin: POST /api/services
router.post('/', adminProtect, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (req.file) serviceData.image = `/uploads/photos/${req.file.filename}`;
    if (typeof serviceData.availableWorkers === 'string') {
      serviceData.availableWorkers = JSON.parse(serviceData.availableWorkers);
    }
    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, service, message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create service' });
  }
});

// Admin: PUT /api/services/:id
router.put('/:id', adminProtect, upload.single('image'), async (req, res) => {
  try {
    const serviceData = { ...req.body };
    if (req.file) serviceData.image = `/uploads/photos/${req.file.filename}`;
    if (typeof serviceData.availableWorkers === 'string') {
      serviceData.availableWorkers = JSON.parse(serviceData.availableWorkers);
    }
    const service = await Service.findByIdAndUpdate(req.params.id, serviceData, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service, message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service' });
  }
});

// Admin: DELETE /api/services/:id
router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service' });
  }
});

export default router;
