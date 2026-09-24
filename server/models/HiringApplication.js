import mongoose from 'mongoose';

const hiringSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    unique: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [16, 'Must be at least 16 years old'],
    max: [70, 'Age cannot exceed 70']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    enum: ['Hair Stylist', 'Barber', 'Beauty Specialist', 'Hair Colorist', 'Hair Spa Specialist', 'Other']
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0
  },
  skills: {
    type: String,
    required: [true, 'Skills are required']
  },
  previousSalonExperience: {
    type: String,
    default: ''
  },
  previousEmployer: {
    type: String,
    default: ''
  },
  expectedSalary: {
    type: String,
    required: [true, 'Expected salary is required']
  },
  availableToJoin: {
    type: String,
    required: [true, 'Available to join date is required']
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: null
  },
  profilePhoto: {
    type: String,
    default: null
  },
  additionalMessage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate application ID before save
hiringSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const count = await mongoose.model('HiringApplication').countDocuments();
    this.applicationId = `APP${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('HiringApplication', hiringSchema);
