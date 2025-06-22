require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration for Render.com
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:8081', 'http://localhost:8082', 'exp://localhost:8081'];

// Add your Render.com domain to allowed origins
if (process.env.RENDER_EXTERNAL_URL) {
  allowedOrigins.push(process.env.RENDER_EXTERNAL_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow Expo development server
    if (origin.includes('localhost') || origin.includes('exp://')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Port configuration for Render.com
const PORT = process.env.PORT || 3001;

// JWT Secret - must be at least 32 characters
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters long');
  process.exit(1);
}

// MongoDB connection with security options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/korkem-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// User Schema with security improvements
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['user', 'developer'], 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  }
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

// Developer account creation middleware (only in development)
const createDeveloperAccount = async () => {
  if (process.env.NODE_ENV === 'production') {
    return; // Don't create developer account in production
  }
  
  try {
    const developerExists = await User.findOne({ role: 'developer' });
    if (!developerExists && process.env.DEVELOPER_EMAIL && process.env.DEVELOPER_PASSWORD) {
      const hashedPassword = await bcrypt.hash(process.env.DEVELOPER_PASSWORD, 12);
      await User.create({
        name: 'Developer',
        email: process.env.DEVELOPER_EMAIL,
        password: hashedPassword,
        role: 'developer',
      });
      console.log('Developer account created successfully (only in development)');
    }
  } catch (error) {
    console.error('Error creating developer account:', error);
  }
};

// Authentication middleware with improved security
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findOne({ _id: decoded.userId }).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Input validation middleware
const validateRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes with improved security
app.post('/api/auth/register', validateRegistration, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password with higher salt rounds
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });
    
    // Generate token with expiration
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.status(201).json({ 
      token, 
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/auth/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to too many failed attempts' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
      }
      
      await user.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({ 
      token, 
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected route example
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json({ 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: 'KorkemApp Backend',
    version: '1.0.0'
  });
});

// Root endpoint for Render.com health checks
app.get('/', (req, res) => {
  res.json({ 
    message: 'KorkemApp Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  createDeveloperAccount();
}); 