const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['mathematics', 'english', 'kiswahili', 'biology', 'chemistry', 'physics', 'history', 'geography', 'cre']
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  questions: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    userResponse: String,
    isCorrect: Boolean,
    timestamp: { type: Date, default: Date.now },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    timeSpent: { type: Number, default: 0 } // in seconds
  }],
  totalQuestions: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  score: { type: Number, default: 0 }, // percentage
  duration: { type: Number, default: 0 }, // in minutes
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  notes: String,
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  }
}, {
  timestamps: true
});

// Virtual for session duration in minutes
studySessionSchema.virtual('sessionDuration').get(function() {
  if (this.endTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60));
  }
  return Math.round((new Date() - this.startTime) / (1000 * 60));
});

// Virtual for accuracy percentage
studySessionSchema.virtual('accuracy').get(function() {
  if (this.totalQuestions === 0) return 0;
  return Math.round((this.correctAnswers / this.totalQuestions) * 100);
});

// Pre-save middleware to calculate score
studySessionSchema.pre('save', function(next) {
  if (this.totalQuestions > 0) {
    this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  }
  next();
});

// Static method to get user's recent sessions
studySessionSchema.statics.getRecentSessions = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName');
};

// Static method to get subject statistics
studySessionSchema.statics.getSubjectStats = function(userId, subject) {
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), subject: subject } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        averageScore: { $avg: '$score' },
        totalTime: { $sum: '$duration' }
      }
    }
  ]);
};

module.exports = mongoose.model('StudySession', studySessionSchema);