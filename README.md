# KorkemApp - Kazakh Language Learning App

A modern React Native application for learning the Kazakh language using Expo and modern teaching methods.

## 🔒 Security Features

### Server Security
- **JWT Authentication** with secure token management
- **Rate Limiting** to prevent brute force attacks
- **Input Validation** using express-validator
- **Password Hashing** with bcrypt (12 salt rounds)
- **Account Lockout** after 5 failed login attempts
- **CORS Protection** with whitelisted origins
- **Helmet.js** for security headers
- **Environment Variables** for sensitive data

### Client Security
- **Secure API Client** with timeout and retry logic
- **Token Management** with automatic refresh
- **Input Sanitization** and validation
- **Network Security** with HTTPS enforcement
- **Error Handling** without exposing sensitive data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/KorkemApp.git
cd KorkemApp
```

2. **Install dependencies**
```bash
npm install
cd server && npm install
```

3. **Environment Setup**
```bash
# Copy environment example
cp server/env.example server/.env

# Edit server/.env with your values
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
MONGODB_URI=your-mongodb-connection-string
DEVELOPER_EMAIL=your-dev-email@example.com
DEVELOPER_PASSWORD=your-secure-dev-password
```

4. **Start the development server**
```bash
# Terminal 1 - Start backend
cd server && npm run dev

# Terminal 2 - Start frontend
npm start
```

## 📱 Building for Production

### Using EAS Build

1. **Install EAS CLI**
```bash
npm install -g @expo/eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure EAS**
```bash
eas build:configure
```

4. **Build for platforms**
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

### Manual Build

1. **iOS**
```bash
expo run:ios --configuration Release
```

2. **Android**
```bash
expo run:android --variant release
```

## 🏪 Publishing to Stores

### App Store (iOS)

1. **Create App Store Connect App**
   - Go to [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app with bundle ID `com.korkem.app`

2. **Configure EAS Submit**
```bash
# Update eas.json with your Apple ID and App Store Connect details
eas submit --platform ios --profile production
```

### Google Play Store (Android)

1. **Create Google Play Console App**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app with package name `com.korkem.app`

2. **Generate Service Account**
   - Create service account in Google Cloud Console
   - Download JSON key file
   - Update `eas.json` with path to key file

3. **Submit to Play Store**
```bash
eas submit --platform android --profile production
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Security
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
JWT_EXPIRES_IN=7d

# Database
MONGODB_URI=mongodb://localhost:27017/korkem-app

# Developer Account (only for development)
DEVELOPER_EMAIL=dev@korkem.app
DEVELOPER_PASSWORD=your-secure-dev-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
ALLOWED_ORIGINS=https://korkemapp.onrender.com,http://localhost:8081,http://localhost:8082
```

### Security Checklist

Before deploying to production:

- [ ] Change default JWT secret to strong 32+ character string
- [ ] Update MongoDB connection string
- [ ] Configure CORS origins for production domains
- [ ] Set NODE_ENV=production
- [ ] Remove developer account creation in production
- [ ] Update bundle identifiers and package names
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and logging
- [ ] Test rate limiting and security features

## 🛠️ Development

### Project Structure
```
KorkemApp/
├── app/                 # Expo Router screens
├── components/          # Reusable components
├── constants/           # App constants and config
├── contexts/            # React contexts
├── data/               # Static data files
├── database/           # SQLite database setup
├── hooks/              # Custom React hooks
├── server/             # Backend API server
├── stores/             # State management
├── translations/       # i18n translations
├── types/              # TypeScript types
├── utils/              # Utility functions
└── assets/             # Images, fonts, etc.
```

### Available Scripts

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run web           # Run on web

# Testing
npm test              # Run tests

# Building
eas build             # Build with EAS
expo build:android    # Build Android APK
expo build:ios        # Build iOS (requires Apple Developer account)
```

## 🔍 Security Testing

### API Security Tests
```bash
# Test rate limiting
curl -X POST https://your-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test CORS
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://your-api.com/api/auth/login
```

### Client Security Tests
- Test token expiration handling
- Verify input validation
- Check network security settings
- Test error handling without data leakage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email elubajernar291@gmail.com or create an issue in this repository.

## 🔄 Updates

The app supports over-the-air updates via Expo Updates. Users will automatically receive updates without going through the app stores.

---

**⚠️ Security Notice**: Always keep your JWT secrets and database credentials secure. Never commit sensitive information to version control.