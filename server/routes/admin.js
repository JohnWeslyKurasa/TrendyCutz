import express from 'express';
import Appointment from '../models/Appointment.js';
import Worker from '../models/Worker.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import HiringApplication from '../models/HiringApplication.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin auth
router.use(adminProtect);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const [
      todayAppointments,
      upcomingAppointments,
      completedAppointments,
      totalCustomers,
      totalWorkers,
      pendingHiring,
      totalReviews,
      ratingData
    ] = await Promise.all([
      Appointment.countDocuments({ date: today }),
      Appointment.countDocuments({ date: { $gte: today }, status: { $in: ['pending', 'confirmed'] } }),
      Appointment.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'user' }),
      Worker.countDocuments({ isActive: true }),
      HiringApplication.countDocuments({ status: 'pending' }),
      Review.countDocuments({ isVisible: true }),
      Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
    ]);

    const avgRating = ratingData[0] ? Math.round(ratingData[0].avg * 10) / 10 : 0;

    res.json({
      success: true,
      stats: {
        todayAppointments,
        upcomingAppointments,
        completedAppointments,
        totalCustomers,
        totalWorkers,
        pendingHiring,
        totalReviews,
        avgRating
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
  try {
    const { status, workerId, date, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (workerId) filter.worker = workerId;
    if (date) filter.date = date;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = Appointment.find(filter)
      .populate('user', 'fullName email phone')
      .populate('worker', 'name role')
      .populate('service', 'name category price')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const [appointments, total] = await Promise.all([
      query,
      Appointment.countDocuments(filter)
    ]);

    res.json({
      success: true,
      appointments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// PUT /api/admin/appointments/:id
router.put('/appointments/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'fullName').populate('worker', 'name').populate('service', 'name');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // If completed, increment worker's completed count
    if (status === 'completed') {
      await Worker.findByIdAndUpdate(appointment.worker._id, { $inc: { completedAppointments: 1 } });
    }

    res.json({ success: true, appointment, message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update appointment' });
  }
});

// DELETE /api/admin/appointments/:id
router.delete('/appointments/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete appointment' });
  }
});

// GET /api/admin/reviews
router.get('/reviews', async (req, res) => {
  try {
    const { workerId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (workerId) filter.worker = workerId;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate('user', 'fullName email')
        .populate('worker', 'name role')
        .populate('appointment', 'date service')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(filter)
    ]);

    res.json({
      success: true,
      reviews,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// PUT /api/admin/reviews/:id (toggle visibility)
router.put('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isVisible = !review.isVisible;
    await review.save();
    res.json({ success: true, review, message: `Review ${review.isVisible ? 'shown' : 'hidden'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// GET /api/admin/hiring
router.get('/hiring', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      HiringApplication.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      HiringApplication.countDocuments(filter)
    ]);

    res.json({
      success: true,
      applications,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
});

// PUT /api/admin/hiring/:id
router.put('/hiring/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await HiringApplication.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, application, message: 'Application status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update application' });
  }
});

// GET /api/admin/workers (including inactive)
router.get('/workers', async (req, res) => {
  try {
    const workers = await Worker.find()
      .populate('services', 'name category')
      .sort('sortOrder');
    res.json({ success: true, workers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch workers' });
  }
});

// GET /api/admin/services (including inactive)
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find()
      .populate('availableWorkers', 'name role')
      .sort('sortOrder');
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services' });
  }
});

// GET /api/admin/customers
router.get('/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = { role: 'user' };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);
    res.json({ success: true, customers: users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers' });
  }
});

export default router;
