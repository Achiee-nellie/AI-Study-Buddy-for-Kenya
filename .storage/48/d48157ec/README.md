# ShuleCoach Backend API

A comprehensive Node.js/Express backend API for the ShuleCoach AI Study Buddy platform, designed specifically for Kenyan KCSE students.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **User Management**: Profile management, progress tracking, subscription handling
- **Payment Integration**: IntaSend API integration for M-Pesa and card payments
- **Study Sessions**: Track and manage study sessions with detailed analytics
- **Quiz System**: Generate and manage KCSE-style quizzes with progress tracking
- **Security**: Rate limiting, input validation, password hashing
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, helmet, cors, express-rate-limit
- **Validation**: express-validator
- **Payment**: IntaSend API integration

## Installation

1. **Clone and setup**:
```bash
cd backend
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**:
```bash
# Make sure MongoDB is running locally or update MONGODB_URI in .env
mongod
```

4. **Run the server**:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh` - Refresh access token
- `GET /me` - Get current user
- `POST /logout` - Logout user
- `POST /forgot-password` - Send password reset email

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /progress` - Get study progress
- `POST /increment-questions` - Increment question count
- `DELETE /account` - Deactivate account

### Payments (`/api/payments`)
- `POST /intasend` - Process IntaSend payment
- `GET /history` - Get payment history
- `POST /callback` - Payment callback handler

### Study Sessions (`/api/study`)
- `POST /session` - Create study session
- `GET /sessions` - Get user sessions
- `GET /sessions/:id` - Get specific session
- `PUT /sessions/:id` - Update session
- `POST /sessions/:id/questions` - Add question to session
- `GET /stats` - Get study statistics

### Quiz (`/api/quiz`)
- `POST /generate` - Generate quiz questions
- `POST /submit` - Submit quiz answers
- `GET /history` - Get quiz history

## Database Models

### User Model
- Personal information (name, email, phone, school)
- Subscription details (plan, status, payment history)
- Study progress (questions asked, streak, subject progress)
- Preferences (language, notifications)

### StudySession Model
- Session metadata (user, subject, topic, duration)
- Questions and answers with timing
- Score calculation and progress tracking
- Session status (active, completed, abandoned)

## Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: Access and refresh token system
- **Rate Limiting**: Configurable request limits per IP
- **Input Validation**: Comprehensive validation using express-validator
- **CORS Protection**: Configurable CORS with credentials support
- **Helmet Security**: Standard security headers

## Payment Integration

### IntaSend Integration
- M-Pesa STK Push payments
- Credit/Debit card processing
- Webhook callback handling
- Payment history tracking
- Subscription management

### Subscription Plans
- **Free**: 10 questions/day, basic features
- **Pro**: Unlimited questions, advanced features
- **School**: Bulk pricing, teacher dashboard

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shulecoach

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# IntaSend
INTASEND_PUBLISHABLE_KEY=your_key
INTASEND_SECRET_KEY=your_secret
INTASEND_TEST_MODE=true

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_password

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend
FRONTEND_URL=http://localhost:3000
```

## API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "error": "Error type",
  "message": "Error description",
  "details": [],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl -X GET http://localhost:5000/api/health
```

## Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Configure proper JWT secrets
4. Set up SSL certificates
5. Configure reverse proxy (nginx)
6. Set up process manager (PM2)

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@shulecoach.com or create an issue in the repository.