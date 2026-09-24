import express from 'express';
import Appointment from '../models/Appointment.js';
import Worker from '../models/Worker.js';
import Service from '../models/Service.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper: Generate time slots for a worker on a date
const generateSlots = (worker, bookedTimes) => {
  const slots = [];
  const [startH, startM] = worker.workingHours.start.split(':').map(Number);
  const [endH, endM] = worker.workingHours.end.split(':').map(Number);
  const [breakStartH, breakStartM] = worker.breakTime.start.split(':').map(Number);
  const [breakEndH, breakEndM] = worker.breakTime.end.split(':').map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;
  const breakStart = breakStartH * 60 + breakStartM;
  const breakEnd = breakEndH * 60 + breakEndM;
  const duration = worker.slotDuration || 30;

  while (current + duration <= end) {
    // Skip break time
    if (current >= breakStart && current < breakEnd) {
      current = breakEnd;
      continue;
    }
    const hh = String(Math.floor(current / 60)).padStart(2, '0');
    const mm = String(current % 60).padStart(2, '0');
    const time = `${hh}:${mm}`;
    const isBooked = bookedTimes.includes(time);
    slots.push({ time, isBooked, display: formatTime(time) });
    current += duration;
  }
  return slots;
};

const formatTime = (time) => {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
};

const getDayName = (dateStr) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(dateStr).getDay()];
};

// GET /api/appointments/available-slots?workerId=&date=
router.get('/available-slots', async (req, res) => {
  try {
    const { workerId, date } = req.query;
    if (!workerId || !date) {
      return res.status(400).json({ success: false, message: 'workerId and date are required' });
    }

    const worker = await Worker.findById(workerId);
    if (!worker || !worker.isActive) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    // Check if worker works on that day
    const dayName = getDayName(date);
    if (!worker.workingDays.includes(dayName)) {
      return res.json({ success: true, slots: [], message: `${worker.name} does not work on ${dayName}` });
    }

    // Get booked times
    const booked = await Appointment.find({
      worker: workerId,
      date,
      status: { $in: ['pending', 'confirmed'] }
    }).select('time');

    const bookedTimes = booked.map(a => a.time);
    const slots = generateSlots(worker, bookedTimes);

    res.json({ success: true, slots, workerName: worker.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch slots' });
  }
});

// GET /api/appointments/my
router.get('/my', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('worker', 'name photo role')
      .populate('service', 'name category price')
      .sort('-createdAt');
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
});

// POST /api/appointments
router.post('/', protect, async (req, res) => {
  try {
    const { workerId, serviceId, date, time, notes } = req.body;

    if (!workerId || !serviceId || !date || !time) {
      return res.status(400).json({ success: false, message: 'Worker, service, date, and time are required' });
    }

    // Validate date is not in past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot book past dates' });
    }

    // Validate worker
    const worker = await Worker.findById(workerId);
    if (!worker || !worker.isActive) {
      return res.status(404).json({ success: false, message: 'Worker not found or inactive' });
    }

    // Validate service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ success: false, message: 'Service not found or inactive' });
    }

    // Check for existing booking (double booking prevention)
    const existingBooking = await Appointment.findOne({
      worker: workerId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose another time.' });
    }

    // Check worker works on that day
    const dayName = getDayName(date);
    if (!worker.workingDays.includes(dayName)) {
      return res.status(400).json({ success: false, message: `${worker.name} does not work on ${dayName}` });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      worker: workerId,
      service: serviceId,
      date,
      time,
      notes: notes || '',
      customerName: req.user.fullName,
      customerPhone: req.user.phone,
      customerEmail: req.user.email
    });

    const populated = await appointment.populate([
      { path: 'worker', select: 'name photo role' },
      { path: 'service', select: 'name price duration' }
    ]);

    res.status(201).json({
      success: true,
      appointment: populated,
      message: 'Appointment booked successfully!'
    });
  } catch (error) {
    console.error('Booking error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked. Please choose another time.' });
    }
    res.status(500).json({ success: false, message: 'Failed to book appointment' });
  }
});

// PUT /api/appointments/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, user: req.user._id });
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    if (appointment.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel appointment' });
  }
});

export default router;
