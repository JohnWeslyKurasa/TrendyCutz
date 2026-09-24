import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: [true, 'Worker is required']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: [true, 'Date is required']
  },
  time: {
    type: String, // HH:MM format
    required: [true, 'Time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  },
  customerName: { type: String },
  customerPhone: { type: String },
  customerEmail: { type: String },
  isReviewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate appointment ID before save
appointmentSchema.pre('save', async function(next) {
  if (!this.appointmentId) {
    const count = await mongoose.model('Appointment').countDocuments();
    this.appointmentId = `TC${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Compound index to prevent double booking
appointmentSchema.index(
  { worker: 1, date: 1, time: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } }
  }
);

export default mongoose.model('Appointment', appointmentSchema);
