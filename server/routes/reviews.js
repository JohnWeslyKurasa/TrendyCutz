import express from 'express';
import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const { workerId, limit = 20 } = req.query;
    const filter = { isVisible: true };
    if (workerId) filter.worker = workerId;

    const reviews = await Review.find(filter)
      .populate('user', 'fullName')
      .populate('worker', 'name role photo')
      .populate('appointment', 'service date')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    if (!appointmentId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Appointment, rating, and comment are required' });
    }

    // Verify appointment belongs to user and is completed
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      user: req.user._id,
      status: 'completed'
    });

    if (!appointment) {
      return res.status(403).json({ success: false, message: 'You can only review completed appointments' });
    }

    if (appointment.isReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this appointment' });
    }

    const review = await Review.create({
      user: req.user._id,
      worker: appointment.worker,
      appointment: appointmentId,
      rating: parseInt(rating),
      comment
    });

    // Mark appointment as reviewed
    appointment.isReviewed = true;
    await appointment.save();

    const populated = await review.populate([
      { path: 'user', select: 'fullName' },
      { path: 'worker', select: 'name role' }
    ]);

    res.status(201).json({ success: true, review: populated, message: 'Review submitted successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this appointment' });
    }
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

export default router;
