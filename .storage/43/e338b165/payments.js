const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// @route   POST /api/payments/intasend
// @desc    Process IntaSend payment
// @access  Private
router.post('/intasend', auth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('currency').isIn(['KES']).withMessage('Currency must be KES'),
  body('method').isIn(['mpesa', 'card']).withMessage('Method must be mpesa or card'),
  body('phone_number').optional().matches(/^254[0-9]{9}$/).withMessage('Invalid phone number'),
  body('email').isEmail().withMessage('Valid email required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { amount, currency, method, phone_number, email, plan } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Simulate IntaSend API call
    const paymentData = {
      amount: amount,
      currency: currency,
      method: method,
      phone_number: phone_number,
      email: email,
      callback_url: `${process.env.BACKEND_URL}/api/payments/callback`,
      reference: `SHULE_${Date.now()}_${user._id}`
    };

    // Simulate payment processing (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      // Update user subscription
      user.subscription.plan = plan === 'Pro Student' || plan === 'Mwanafunzi Pro' ? 'pro' : 'school';
      user.subscription.status = 'active';
      user.subscription.startDate = new Date();
      user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      
      // Add payment to history
      user.subscription.paymentHistory.push({
        amount: amount,
        currency: currency,
        method: method,
        transactionId: paymentData.reference,
        date: new Date(),
        status: 'completed'
      });

      await user.save();

      res.json({
        success: true,
        message: 'Payment processed successfully',
        transaction_id: paymentData.reference,
        subscription: user.subscription
      });
    } else {
      // Payment failed
      res.status(400).json({
        success: false,
        error: 'Payment failed',
        message: 'Payment could not be processed. Please try again.'
      });
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      error: 'Payment processing failed',
      message: error.message
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get user payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      paymentHistory: user.subscription.paymentHistory,
      currentSubscription: {
        plan: user.subscription.plan,
        status: user.subscription.status,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        isActive: user.isSubscriptionActive
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      error: 'Failed to get payment history',
      message: error.message
    });
  }
});

// @route   POST /api/payments/callback
// @desc    Handle payment callback from IntaSend
// @access  Public
router.post('/callback', async (req, res) => {
  try {
    const { transaction_id, status, reference } = req.body;
    
    // Extract user ID from reference
    const userId = reference.split('_')[2];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Find the payment in history and update status
    const payment = user.subscription.paymentHistory.find(
      p => p.transactionId === reference
    );
    
    if (payment) {
      payment.status = status === 'completed' ? 'completed' : 'failed';
      
      if (status === 'completed') {
        user.subscription.status = 'active';
      }
      
      await user.save();
    }

    res.json({ message: 'Callback processed successfully' });

  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({
      error: 'Callback processing failed',
      message: error.message
    });
  }
});

module.exports = router;