# WhisperBox

**A secure, AI-enhanced platform for emotional journaling and mental wellness. Write freely, reflect deeply, heal gently.**

WhisperBox provides a private, encrypted space for emotional journaling with AI-powered insights to support mental health and emotional wellbeing. All features are available to all users with generous usage limits.

## ✨ Features

### 🤗 Emotional Journaling
- **Private Writing Space**: Secure, encrypted journaling environment
- **Emotional Analysis**: AI-powered detection of emotional tone and patterns
- **Progress Tracking**: Monitor your emotional journey over time
- **Mood Logging**: Track your emotional state with each entry

### 🧠 AI Mental Health Support
- **Compassionate Responses**: AI companion trained in trauma-informed care principles
- **Personalized Insights**: Tailored emotional analysis and coping strategies
- **Crisis Detection**: Automatic identification of crisis situations with resource recommendations
- **Self-Care Suggestions**: Personalized wellness activities and breathing exercises

### 🛡️ Privacy & Security
- **End-to-End Encryption**: All journal entries are encrypted client-side
- **Magic Link Authentication**: Secure, passwordless authentication
- **No Data Mining**: Your personal information is never sold or shared
- **Local Storage Options**: Option to keep data private with download capabilities

### 🌱 Wellness Tools
- **Breathing Exercises**: Guided 4-7-8 breathing technique
- **Grounding Techniques**: 5-4-3-2-1 sensory grounding exercises
- **Crisis Resources**: 24/7 hotlines and emergency contacts
- **Calming Interface**: Distraction-free, accessible design for all users

### 📱 Accessibility & Design
- **Progressive Web App (PWA)**: Works offline and can be installed as an app
- **Dark Mode**: Calming, low-light interface optimized for wellbeing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **High Contrast Support**: Accessible design for users with visual needs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB database
- OpenRouter API key (for AI features)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whisperbox.git
   cd whisperbox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/whisperbox
   
   # Authentication & Security
   JWT_SECRET=your-super-secure-jwt-secret-here
   ENCRYPTION_SECRET=your-encryption-secret-for-content
   
   # AI Integration
   OPENROUTER_API_KEY=your-openrouter-api-key
   
   # Email (for magic links)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Application
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   npm run db:init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Schema Validation
- **AI Integration**: OpenRouter API (MoonshotAI: Kimi K2)
- **Authentication**: Magic Links + JWT Sessions
- **Security**: bcryptjs, crypto-js for encryption
- **PWA**: next-pwa for offline capabilities

### Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   API Routes    │    │    Database     │
│                 │    │                 │    │                 │
│ • React/Next.js │◄──►│ • Authentication│◄──►│ • MongoDB       │
│ • PWA Support   │    │ • Journal API   │    │ • Encrypted     │
│ • Encryption    │    │ • AI Integration│    │   Storage       │
│ • Offline Mode  │    │ • User Management│   │ • Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  External APIs  │
                       │                 │
                       │ • OpenRouter    │
                       │ • AI Models     │
                       │ • Email Service │
                       └─────────────────┘
```

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  name: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  
  // Usage Limits (Fixed for all users)
  aiChatsUsed: Number,
  aiChatsLimit: Number, // Default: 10 (generous limit)
  
  // Authentication
  magicLinkToken: String,
  magicLinkExpiration: Date,
  
  // Statistics
  totalConversations: Number,
  emotionalJourney: [String], // Array of emotion stages
  encryptionKeyHash: String // For verification
}
```

#### Journal Entries Collection (formerly Conversations)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  personId: String,
  title: String,
  description: String,
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date,
  isActive: Boolean,
  isArchived: Boolean,
  isBurned: Boolean,
  messageCount: Number,
  emotionalScore: Number,
  currentStage: String, // 'denial' | 'anger' | 'bargaining' | 'depression' | 'acceptance'
  stageHistory: Array,
  aiEnabled: Boolean,
  aiResponsesUsed: Number,
  isVectorized: Boolean,
  vectorIds: [String],
  readyForClosure: Boolean,
  metadata: Object
}
```

#### Messages Collection
```javascript
{
  _id: ObjectId,
  conversationId: ObjectId,
  userId: ObjectId,
  content: String, // Encrypted
  contentHash: String,
  createdAt: Date,
  updatedAt: Date,
  isEdited: Boolean,
  messageType: String, // 'user' | 'ai' | 'system'
  emotionalAnalysis: Object,
  aiResponse: Object,
  timeSpent: Number,
  wordCount: Number,
  characterCount: Number,
  isDeleted: Boolean,
  metadata: Object,
  isVectorized: Boolean,
  vectorId: String
}
```

## 📡 API Documentation

### Authentication
All API endpoints require authentication via JWT tokens in cookies.

#### POST `/api/auth/magic-link`
Send magic link for authentication
```javascript
// Request
{ "email": "user@example.com", "name": "User Name" }

// Response
{ "success": true, "message": "Magic link sent!" }
```

#### GET `/api/auth/verify?token=...`
Verify magic link token and create session

#### GET `/api/auth/me`
Get current user information
```javascript
// Response
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "aiChatsUsed": 3,
    "aiChatsLimit": 10,
    "aiChatsRemaining": 7,
    "totalConversations": 5,
    "emotionalJourney": ["denial", "anger", "bargaining"]
  }
}
```

### Journal Entries

#### GET `/api/journal`
Get user's journal entries
```javascript
// Response
{
  "success": true,
  "entries": [
    {
      "id": "...",
      "title": "Letter to Sarah",
      "preview": "I've been thinking about...",
      "createdAt": "2024-01-15T10:30:00Z",
      "emotionalScore": 65,
      "currentStage": "bargaining",
      "messageCount": 3,
      "lastMessageAt": "2024-01-15T14:22:00Z"
    }
  ]
}
```

#### POST `/api/journal`
Create new journal entry
```javascript
// Request
{
  "title": "Letter to Mom",
  "content": "Dear Mom, I've been thinking...",
  "mood": "sad",
  "tags": ["family", "grief"]
}

// Response
{
  "success": true,
  "entry": { /* entry object */ },
  "aiAnalysis": {
    "emotionalAnalysis": { /* emotional insights */ },
    "supportResponse": { /* compassionate response */ },
    "mentalHealthMetrics": { /* crisis level, resources */ }
  }
}
```

## 🔒 Security & Privacy

### Data Protection
- **Client-Side Encryption**: All journal content is encrypted before transmission
- **Server-Side Security**: Additional encryption layer for database storage
- **No Third-Party Analytics**: No tracking pixels or data collection services
- **GDPR Compliant**: Right to data export and deletion

### Authentication Security
- **Magic Links**: Passwordless authentication reduces attack vectors
- **JWT Sessions**: Secure, stateless session management
- **Token Expiration**: Automatic session expiry for security
- **Rate Limiting**: Protection against brute force attacks

### Infrastructure Security
- **HTTPS Only**: All communications encrypted in transit
- **Environment Variables**: Sensitive keys stored securely
- **Database Security**: MongoDB with authentication and encryption
- **Regular Updates**: Dependencies kept current for security patches

## 🧠 Mental Health Considerations

### AI Safety & Ethics
- **Trauma-Informed Design**: AI responses prioritize safety and validation
- **Crisis Detection**: Automatic identification of high-risk situations
- **Professional Resource Integration**: Clear pathways to professional help
- **Non-Judgmental Approach**: AI trained to be supportive, not diagnostic

### Crisis Resources
WhisperBox includes integrated crisis support resources:
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **International Association for Suicide Prevention**: Global resources
- **Emergency Services**: Clear guidance to call 911/emergency services

### Disclaimer
WhisperBox is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact emergency services or a mental health professional immediately.

## 🎯 Usage Limits

### Generous Limits for All Users
- **AI Analysis**: 10 journal analyses per user (resets periodically)
- **Unlimited Journaling**: Write as much as you need
- **Full Feature Access**: All wellness tools and resources available
- **Data Export**: Download your complete journal history anytime

### Fair Usage Policy
While we provide generous limits, we monitor for abuse to ensure service availability for all users. Excessive automated usage may result in temporary restrictions.

## 🛠️ Development Guide

### Project Structure
```
whisperbox/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── journal/           # Journal interface
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── JournalInterface.tsx
│   ├── CalmingFeatures.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── whisperBoxAI.ts    # AI integration
│   ├── database.ts        # Database functions
│   ├── auth.ts           # Authentication
│   └── types.ts          # TypeScript definitions
└── public/               # Static assets
```

### Component Architecture
- **JournalInterface**: Main journaling component with real-time features
- **CalmingFeatures**: Wellness tools (breathing, grounding exercises)
- **AuthModal**: Secure authentication flow
- **Navbar**: Navigation with crisis support integration

### AI Integration
The AI system uses MoonshotAI: Kimi K2 through OpenRouter with carefully crafted prompts for:
- Emotional tone analysis
- Compassionate response generation
- Crisis level detection
- Self-care recommendation

### Database Management
```bash
# Initialize database with schema validation
npm run db:init

# Reset database (careful!)
npm run db:reset

# Check database status
npm run db:check
```

### Building & Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🚀 Deployment

### Environment Requirements
- Node.js 18+
- MongoDB 5.0+
- SSL certificate for HTTPS

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Railway**: Good for full-stack apps with database
- **DigitalOcean**: Flexible VPS options
- **Heroku**: Easy deployment with MongoDB Atlas

### Production Configuration
1. Set all environment variables
2. Configure MongoDB with authentication
3. Set up SSL/HTTPS
4. Configure email service for magic links
5. Set up monitoring and logging

## 🤝 Contributing

We welcome contributions that improve mental health support and user privacy. Please read our contribution guidelines and code of conduct.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Reporting Issues
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Specify environment details
- For security issues, email us directly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mental Health Community**: For guidance on trauma-informed design
- **Open Source Contributors**: For the amazing tools and libraries
- **Users**: For trusting us with their emotional journeys

---

**Remember**: Your mental health matters. If you're in crisis, please reach out for help immediately. WhisperBox is here to support your journey, but professional help is always available when you need it.

For support, email: support@whisperbox.app  
Crisis resources: [https://whisperbox.app/crisis-resources](https://whisperbox.app/crisis-resources) 