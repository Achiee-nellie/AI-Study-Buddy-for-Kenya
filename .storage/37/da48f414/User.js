const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't include password in queries by default
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^254[0-9]{9}$/, 'Please enter a valid Kenyan phone number (254XXXXXXXXX)']
  },
  school: {
    type: String,
    required: [true, 'School name is required'],
    trim: true,
    maxlength: [100, 'School name cannot exceed 100 characters']
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'school'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // Free plan never expires, pro/school expire after 30 days
        if (this.subscription.plan === 'free') {
          return new Date('2099-12-31');
        }
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }
    },
    paymentHistory: [{
      amount: Number,
      currency: { type: String, default: 'KES' },
      method: { type: String, enum: ['mpesa', 'card'] },
      transactionId: String,
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
    }]
  },
  studyProgress: {
    totalQuestionsAsked: { type: Number, default: 0 },
    questionsToday: { type: Number, default: 0 },
    lastQuestionDate: { type: Date, default: Date.now },
    studyStreak: { type: Number, default: 0 },
    lastStudyDate: { type: Date, default: Date.now },
    subjectProgress: {
      mathematics: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      english: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      kiswahili: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      biology: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      chemistry: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      physics: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      history: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      geography: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
      cre: { questions: { type: Number, default: 0 }, score: { type: Number, default: 0 } }
    }
  },
  preferences: {
    language: { type: String, enum: ['en', 'sw'], default: 'en' },
    notifications: { type: Boolean, default: true },
    studyReminders: { type: Boolean, default: true }
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual to check if subscription is active
userSchema.virtual('isSubscriptionActive').get(function() {
  return this.subscription.status === 'active' && this.subscription.endDate > new Date();
});

// Virtual to get daily question limit
userSchema.virtual('dailyQuestionLimit').get(function() {
  if (this.subscription.plan === 'pro' || this.subscription.plan === 'school') {
    return Infinity;
  }
  return 10; // Free plan limit
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Pre-save middleware to reset daily questions if new day
userSchema.pre('save', function(next) {
  const today = new Date();
  const lastQuestionDate = new Date(this.studyProgress.lastQuestionDate);
  
  // Reset daily count if it's a new day
  if (today.toDateString() !== lastQuestionDate.toDateString()) {
    this.studyProgress.questionsToday = 0;
  }
  
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if user can ask questions
userSchema.methods.canAskQuestions = function() {
  if (this.subscription.plan === 'pro' || this.subscription.plan === 'school') {
    return true;
  }
  return this.studyProgress.questionsToday < 10;
};

// Instance method to increment question count
userSchema.methods.incrementQuestionCount = function(subject = null) {
  this.studyProgress.totalQuestionsAsked += 1;
  this.studyProgress.questionsToday += 1;
  this.studyProgress.lastQuestionDate = new Date();
  
  if (subject && this.studyProgress.subjectProgress[subject]) {
    this.studyProgress.subjectProgress[subject].questions += 1;
  }
  
  return this.save();
};

// Instance method to update study streak
userSchema.methods.updateStudyStreak = function() {
  const today = new Date();
  const lastStudy = new Date(this.studyProgress.lastStudyDate);
  const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.studyProgress.studyStreak += 1;
  } else if (daysDiff > 1) {
    // Streak broken
    this.studyProgress.studyStreak = 1;
  }
  // If daysDiff === 0, same day, don't change streak
  
  this.studyProgress.lastStudyDate = today;
  return this.save();
};

// Static method to find users by subscription plan
userSchema.statics.findBySubscriptionPlan = function(plan) {
  return this.find({ 'subscription.plan': plan });
};

module.exports = mongoose.model('User', userSchema);