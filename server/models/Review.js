import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true // One review per appointment
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// After save, update worker rating
reviewSchema.post('save', async function() {
  const Worker = mongoose.model('Worker');
  const worker = await Worker.findById(this.worker);
  if (worker) await worker.updateRating();
});

// After delete, update worker rating
reviewSchema.post('deleteOne', { document: true }, async function() {
  const Worker = mongoose.model('Worker');
  const worker = await Worker.findById(this.worker);
  if (worker) await worker.updateRating();
});

export default mongoose.model('Review', reviewSchema);
