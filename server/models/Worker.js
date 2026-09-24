import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Worker name is required'],
    trim: true
  },
  photo: {
    type: String,
    default: null
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required']
  },
  experience: {
    type: Number,
    required: [true, 'Experience years required'],
    min: 0
  },
  bio: {
    type: String,
    default: ''
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  workingDays: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  workingHours: {
    start: { type: String, default: '08:00' },
    end: { type: String, default: '21:00' }
  },
  breakTime: {
    start: { type: String, default: '13:00' },
    end: { type: String, default: '14:00' }
  },
  slotDuration: {
    type: Number,
    default: 30 // minutes
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  completedAppointments: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update rating average
workerSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { worker: this._id } },
    {
      $group: {
        _id: '$worker',
        average: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  if (stats.length > 0) {
    this.rating.average = Math.round(stats[0].average * 10) / 10;
    this.rating.count = stats[0].count;
    await this.save();
  }
};

export default mongoose.model('Worker', workerSchema);
