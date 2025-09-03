const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const StudySession = require('../models/StudySession');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      user: user,
      stats: {
        totalQuestions: user.studyProgress.totalQuestionsAsked,
        questionsToday: user.studyProgress.questionsToday,
        studyStreak: user.studyProgress.studyStreak,
        canAskQuestions: user.canAskQuestions(),
        dailyLimit: user.dailyQuestionLimit,
        isSubscriptionActive: user.isSubscriptionActive
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: error.message
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('phoneNumber').optional().matches(/^254[0-9]{9}$/),
  body('school').optional().trim().isLength({ min: 2, max: 100 }),
  body('preferences.language').optional().isIn(['en', 'sw']),
  body('preferences.notifications').optional().isBoolean(),
  body('preferences.studyReminders').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['firstName', 'lastName', 'phoneNumber', 'school', 'preferences'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    Object.assign(user, updates);
    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// @route   GET /api/users/progress
// @desc    Get user study progress
// @access  Private
router.get('/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Get recent study sessions
    const recentSessions = await StudySession.getRecentSessions(user._id, 10);
    
    // Calculate subject statistics
    const subjectStats = {};
    for (const subject of Object.keys(user.studyProgress.subjectProgress)) {
      const stats = await StudySession.getSubjectStats(user._id, subject);
      subjectStats[subject] = stats[0] || {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageScore: 0,
        totalTime: 0
      };
    }

    res.json({
      progress: user.studyProgress,
      recentSessions: recentSessions,
      subjectStats: subjectStats,
      streakInfo: {
        current: user.studyProgress.studyStreak,
        lastStudy: user.studyProgress.lastStudyDate
      }
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      error: 'Failed to get progress',
      message: error.message
    });
  }
});

// @route   POST /api/users/increment-questions
// @desc    Increment user question count
// @access  Private
router.post('/increment-questions', auth, [
  body('subject').optional().isIn(['mathematics', 'english', 'kiswahili', 'biology', 'chemistry', 'physics', 'history', 'geography', 'cre'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if user can ask questions
    if (!user.canAskQuestions()) {
      return res.status(403).json({
        error: 'Daily limit reached',
        message: 'You have reached your daily question limit. Upgrade to Pro for unlimited questions.',
        limit: user.dailyQuestionLimit,
        used: user.studyProgress.questionsToday
      });
    }

    // Increment question count
    await user.incrementQuestionCount(req.body.subject);
    await user.updateStudyStreak();

    res.json({
      message: 'Question count updated',
      questionsToday: user.studyProgress.questionsToday,
      totalQuestions: user.studyProgress.totalQuestionsAsked,
      canAskMore: user.canAskQuestions(),
      studyStreak: user.studyProgress.studyStreak
    });

  } catch (error) {
    console.error('Increment questions error:', error);
    res.status(500).json({
      error: 'Failed to increment questions',
      message: error.message
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Deactivate account instead of deleting
    user.isActive = false;
    await user.save();

    res.json({
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      error: 'Failed to deactivate account',
      message: error.message
    });
  }
});

module.exports = router;