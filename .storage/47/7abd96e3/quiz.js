const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const StudySession = require('../models/StudySession');
const auth = require('../middleware/auth');

const router = express.Router();

// Sample KCSE questions database
const questionBank = {
  mathematics: [
    {
      question: "Solve for x: 2x + 5 = 13",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correct: 1,
      difficulty: "easy",
      topic: "Linear Equations"
    },
    {
      question: "Find the area of a circle with radius 7cm (π = 22/7)",
      options: ["154 cm²", "144 cm²", "164 cm²", "174 cm²"],
      correct: 0,
      difficulty: "medium",
      topic: "Geometry"
    }
  ],
  english: [
    {
      question: "Choose the correct form: 'She _____ to school every day.'",
      options: ["go", "goes", "going", "gone"],
      correct: 1,
      difficulty: "easy",
      topic: "Grammar"
    }
  ],
  chemistry: [
    {
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "NaCl", "CH4"],
      correct: 0,
      difficulty: "easy",
      topic: "Chemical Formulas"
    }
  ],
  biology: [
    {
      question: "Which organelle is known as the 'powerhouse of the cell'?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
      correct: 1,
      difficulty: "medium",
      topic: "Cell Biology"
    }
  ]
};

// @route   POST /api/quiz/generate
// @desc    Generate quiz questions
// @access  Private
router.post('/generate', auth, [
  body('subject').isIn(['mathematics', 'english', 'kiswahili', 'biology', 'chemistry', 'physics', 'history', 'geography', 'cre']).withMessage('Invalid subject'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
  body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Question count must be between 1 and 20'),
  body('topic').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Topic must be 1-100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { subject, difficulty, count = 5, topic } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if user can generate quiz
    if (!user.canAskQuestions()) {
      return res.status(403).json({
        error: 'Daily limit reached',
        message: 'You have reached your daily question limit. Upgrade to Pro for unlimited questions.'
      });
    }

    // Get questions from bank or generate
    let questions = questionBank[subject] || [];
    
    // Filter by difficulty if specified
    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty);
    }

    // Filter by topic if specified
    if (topic) {
      questions = questions.filter(q => 
        q.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }

    // Shuffle and limit questions
    const shuffled = questions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    // If no questions available, generate sample ones
    if (selectedQuestions.length === 0) {
      selectedQuestions.push({
        question: `Sample ${subject} question about ${topic || 'general concepts'}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correct: 0,
        difficulty: difficulty || "medium",
        topic: topic || "General"
      });
    }

    res.json({
      questions: selectedQuestions,
      subject: subject,
      difficulty: difficulty,
      topic: topic,
      count: selectedQuestions.length,
      remainingQuestions: user.dailyQuestionLimit - user.studyProgress.questionsToday
    });

  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({
      error: 'Failed to generate quiz',
      message: error.message
    });
  }
});

// @route   POST /api/quiz/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/submit', auth, [
  body('sessionId').isMongoId().withMessage('Invalid session ID'),
  body('answers').isArray().withMessage('Answers must be an array'),
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

    const { sessionId, answers, timeSpent = 0 } = req.body;
    
    const session = await StudySession.findOne({
      _id: sessionId,
      user: req.user.userId
    });

    if (!session) {
      return res.status(404).json({
        error: 'Study session not found'
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const questionResults = answers.map((answer, index) => {
      const question = session.questions[index];
      const isCorrect = answer.selectedOption === answer.correctOption;
      if (isCorrect) correctAnswers++;

      return {
        question: question?.question || `Question ${index + 1}`,
        selectedOption: answer.selectedOption,
        correctOption: answer.correctOption,
        isCorrect: isCorrect,
        timeSpent: answer.timeSpent || 0
      };
    });

    // Update session
    session.totalQuestions = answers.length;
    session.correctAnswers = correctAnswers;
    session.score = Math.round((correctAnswers / answers.length) * 100);
    session.duration = Math.round(timeSpent / 60); // Convert to minutes
    session.status = 'completed';
    session.endTime = new Date();
    
    // Add detailed results
    session.questions = questionResults.map(result => ({
      question: result.question,
      answer: `Option ${result.correctOption}`,
      userResponse: `Option ${result.selectedOption}`,
      isCorrect: result.isCorrect,
      timeSpent: result.timeSpent,
      timestamp: new Date()
    }));

    await session.save();

    // Update user progress
    const user = await User.findById(req.user.userId);
    if (user.studyProgress.subjectProgress[session.subject]) {
      user.studyProgress.subjectProgress[session.subject].questions += answers.length;
      user.studyProgress.subjectProgress[session.subject].score = 
        Math.round((user.studyProgress.subjectProgress[session.subject].score + session.score) / 2);
    }
    
    await user.updateStudyStreak();
    await user.save();

    res.json({
      message: 'Quiz submitted successfully',
      results: {
        score: session.score,
        correctAnswers: correctAnswers,
        totalQuestions: answers.length,
        timeSpent: timeSpent,
        questionResults: questionResults
      },
      session: session
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      error: 'Failed to submit quiz',
      message: error.message
    });
  }
});

// @route   GET /api/quiz/history
// @desc    Get quiz history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, subject } = req.query;
    
    const query = { 
      user: req.user.userId,
      status: 'completed'
    };
    
    if (subject) query.subject = subject;

    const sessions = await StudySession.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('subject topic score totalQuestions correctAnswers duration createdAt');

    const total = await StudySession.countDocuments(query);

    res.json({
      history: sessions,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      error: 'Failed to get quiz history',
      message: error.message
    });
  }
});

module.exports = router;