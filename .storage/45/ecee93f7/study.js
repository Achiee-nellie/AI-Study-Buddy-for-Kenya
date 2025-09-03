const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const StudySession = require('../models/StudySession');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/study/session
// @desc    Create new study session
// @access  Private
router.post('/session', auth, [
  body('subject').isIn(['mathematics', 'english', 'kiswahili', 'biology', 'chemistry', 'physics', 'history', 'geography', 'cre']).withMessage('Invalid subject'),
  body('topic').trim().isLength({ min: 1, max: 100 }).withMessage('Topic must be 1-100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { subject, topic } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if user can start a new session
    if (!user.canAskQuestions()) {
      return res.status(403).json({
        error: 'Daily limit reached',
        message: 'You have reached your daily question limit. Upgrade to Pro for unlimited questions.'
      });
    }

    // Create new study session
    const studySession = new StudySession({
      user: user._id,
      subject: subject,
      topic: topic
    });

    await studySession.save();

    res.status(201).json({
      message: 'Study session created successfully',
      session: studySession
    });

  } catch (error) {
    console.error('Create study session error:', error);
    res.status(500).json({
      error: 'Failed to create study session',
      message: error.message
    });
  }
});

// @route   GET /api/study/sessions
// @desc    Get user's study sessions
// @access  Private
router.get('/sessions', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, subject, status } = req.query;
    
    const query = { user: req.user.userId };
    if (subject) query.subject = subject;
    if (status) query.status = status;

    const sessions = await StudySession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'firstName lastName');

    const total = await StudySession.countDocuments(query);

    res.json({
      sessions: sessions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Get study sessions error:', error);
    res.status(500).json({
      error: 'Failed to get study sessions',
      message: error.message
    });
  }
});

// @route   GET /api/study/sessions/:id
// @desc    Get specific study session
// @access  Private
router.get('/sessions/:id', auth, async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('user', 'firstName lastName');

    if (!session) {
      return res.status(404).json({
        error: 'Study session not found'
      });
    }

    res.json({
      session: session
    });

  } catch (error) {
    console.error('Get study session error:', error);
    res.status(500).json({
      error: 'Failed to get study session',
      message: error.message
    });
  }
});

// @route   PUT /api/study/sessions/:id
// @desc    Update study session
// @access  Private
router.put('/sessions/:id', auth, [
  body('questions').optional().isArray().withMessage('Questions must be an array'),
  body('status').optional().isIn(['active', 'completed', 'abandoned']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!session) {
      return res.status(404).json({
        error: 'Study session not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['questions', 'status', 'notes', 'endTime'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // If completing session, set end time and calculate stats
    if (updates.status === 'completed' && !session.endTime) {
      updates.endTime = new Date();
      
      if (updates.questions) {
        updates.totalQuestions = updates.questions.length;
        updates.correctAnswers = updates.questions.filter(q => q.isCorrect).length;
      }
    }

    Object.assign(session, updates);
    await session.save();

    res.json({
      message: 'Study session updated successfully',
      session: session
    });

  } catch (error) {
    console.error('Update study session error:', error);
    res.status(500).json({
      error: 'Failed to update study session',
      message: error.message
    });
  }
});

// @route   POST /api/study/sessions/:id/questions
// @desc    Add question to study session
// @access  Private
router.post('/sessions/:id/questions', auth, [
  body('question').trim().isLength({ min: 1, max: 500 }).withMessage('Question must be 1-500 characters'),
  body('answer').trim().isLength({ min: 1, max: 1000 }).withMessage('Answer must be 1-1000 characters'),
  body('userResponse').optional().trim().isLength({ max: 1000 }).withMessage('User response cannot exceed 1000 characters'),
  body('isCorrect').optional().isBoolean().withMessage('isCorrect must be boolean'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('timeSpent').optional().isNumeric().withMessage('Time spent must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!session) {
      return res.status(404).json({
        error: 'Study session not found'
      });
    }

    const user = await User.findById(req.user.userId);
    
    // Check if user can ask more questions
    if (!user.canAskQuestions()) {
      return res.status(403).json({
        error: 'Daily limit reached',
        message: 'You have reached your daily question limit. Upgrade to Pro for unlimited questions.'
      });
    }

    // Add question to session
    const questionData = {
      question: req.body.question,
      answer: req.body.answer,
      userResponse: req.body.userResponse,
      isCorrect: req.body.isCorrect,
      difficulty: req.body.difficulty || 'medium',
      timeSpent: req.body.timeSpent || 0,
      timestamp: new Date()
    };

    session.questions.push(questionData);
    session.totalQuestions = session.questions.length;
    
    if (questionData.isCorrect !== undefined) {
      session.correctAnswers = session.questions.filter(q => q.isCorrect).length;
    }

    await session.save();

    // Increment user question count
    await user.incrementQuestionCount(session.subject);

    res.json({
      message: 'Question added successfully',
      session: session,
      questionCount: user.studyProgress.questionsToday
    });

  } catch (error) {
    console.error('Add question error:', error);
    res.status(500).json({
      error: 'Failed to add question',
      message: error.message
    });
  }
});

// @route   GET /api/study/stats
// @desc    Get study statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const { timeframe = '30' } = req.query; // days
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeframe));

    // Get sessions in timeframe
    const sessions = await StudySession.find({
      user: req.user.userId,
      createdAt: { $gte: startDate }
    });

    // Calculate statistics
    const stats = {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.status === 'completed').length,
      totalQuestions: sessions.reduce((sum, s) => sum + s.totalQuestions, 0),
      totalCorrect: sessions.reduce((sum, s) => sum + s.correctAnswers, 0),
      averageScore: 0,
      totalStudyTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      subjectBreakdown: {}
    };

    if (stats.totalQuestions > 0) {
      stats.averageScore = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
    }

    // Subject breakdown
    const subjects = ['mathematics', 'english', 'kiswahili', 'biology', 'chemistry', 'physics', 'history', 'geography', 'cre'];
    subjects.forEach(subject => {
      const subjectSessions = sessions.filter(s => s.subject === subject);
      stats.subjectBreakdown[subject] = {
        sessions: subjectSessions.length,
        questions: subjectSessions.reduce((sum, s) => sum + s.totalQuestions, 0),
        correct: subjectSessions.reduce((sum, s) => sum + s.correctAnswers, 0),
        averageScore: 0
      };
      
      if (stats.subjectBreakdown[subject].questions > 0) {
        stats.subjectBreakdown[subject].averageScore = Math.round(
          (stats.subjectBreakdown[subject].correct / stats.subjectBreakdown[subject].questions) * 100
        );
      }
    });

    res.json({
      stats: stats,
      userProgress: user.studyProgress,
      timeframe: `${timeframe} days`
    });

  } catch (error) {
    console.error('Get study stats error:', error);
    res.status(500).json({
      error: 'Failed to get study statistics',
      message: error.message
    });
  }
});

module.exports = router;