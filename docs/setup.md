# FitLife Setup Guide

This guide provides detailed instructions for setting up the FitLife development environment.

## Prerequisites

### Required Software

1. **Node.js** (v20.x or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **pnpm** (v10.x or higher)
   ```bash
   npm install -g pnpm@latest
   # Verify: pnpm --version
   ```

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

4. **Firebase Account**
   - Create account at [firebase.google.com](https://firebase.google.com/)
   - Create a new project or use existing one

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project (fitlife-9985f)
3. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Enable **Email/Password** provider
4. Click "Save"

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **Production mode** (we'll add security rules later)
4. Choose your region (e.g., us-central)
5. Click "Enable"

### 4. Enable Storage

1. Go to **Storage**
2. Click "Get started"
3. Start in **Production mode**
4. Choose same region as Firestore
5. Click "Done"

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web** icon (`</>`)
4. Register app with nickname "FitLife Web"
5. Copy the configuration values:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
   - measurementId

### 6. Create Service Account (for CI/CD)

1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Store securely - this is needed for GitHub Actions

## Environment Variables

### Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your Firebase values:
   ```bash
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=G-your-measurement-id
   ```

3. **Never commit `.env` to git!** It's already in `.gitignore`.

### GitHub Actions (CI/CD)

Add these secrets in your GitHub repository:

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Add each secret:
   - `FIREBASE_SERVICE_ACCOUNT` - Paste entire JSON file content
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd fitlife
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs dependencies for all packages in the monorepo.

### 3. Build Packages

```bash
pnpm build
```

This builds all packages in the correct order.

### 4. Start Development Server

```bash
pnpm dev
```

The app will start at `http://localhost:5173`

## IDE Setup

### VS Code (Recommended)

#### Required Extensions

Install these extensions for the best development experience:

- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Tailwind autocomplete
- **Path Intellisense** (`christian-kohler.path-intellisense`) - Path autocomplete
- **TypeScript Vue Plugin (Volar)** - Better TypeScript support

#### Settings

Create `.vscode/settings.json` in project root:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Turborepo Caching

Turborepo caches build outputs for faster rebuilds.

### Local Cache

Cache is stored in `node_modules/.cache/turbo/`

### Clear Cache

```bash
pnpm clean
```

## Common Issues

### Issue: "Missing environment variable" error

**Solution**: Ensure all `VITE_FIREBASE_*` variables are set in `.env`

```bash
# Check if .env file exists
cat .env

# Verify all variables are set
grep VITE_FIREBASE .env
```

### Issue: "Module not found" errors

**Solution**: Rebuild packages in the correct order

```bash
pnpm clean
pnpm install
pnpm build
```

### Issue: Port 5173 already in use

**Solution**: Kill the process or use a different port

```bash
# Kill process on port 5173 (Unix/macOS)
lsof -ti:5173 | xargs kill -9

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
pnpm dev -- --port 3000
```

### Issue: Firebase "Permission denied" errors

**Solution**: Update Firestore security rules

Go to Firestore → Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Adjust other rules as needed
  }
}
```

### Issue: Build fails with TypeScript errors

**Solution**: Run type-check to see detailed errors

```bash
pnpm type-check
```

Fix the errors, then rebuild:

```bash
pnpm build
```

### Issue: Slow builds

**Solution**: Turborepo should cache builds. If builds are still slow:

1. Check cache is enabled in `turbo.json`
2. Clear and rebuild cache:
   ```bash
   rm -rf node_modules/.cache
   pnpm build
   ```

### Issue: pnpm install fails

**Solution**: Clear pnpm cache and retry

```bash
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Firestore Data Structure

### Collections

- **users/{userId}**
  - profile: UserProfile
  - workouts/{workoutId}: WorkoutLog
  - nutrition/{nutritionId}: NutritionLog
  - goals/{goalId}: Goal

### Example Documents

**User Profile** (`users/{userId}/profile`):
```json
{
  "name": "John Doe",
  "height": 180,
  "weight": 75,
  "age": 30,
  "unitSystem": "metric",
  "theme": "dark",
  "photoURL": "https://...",
  "weightHistory": [
    { "date": "2025-01-01", "weight": 75 }
  ]
}
```

**Workout Log** (`users/{userId}/workouts/{workoutId}`):
```json
{
  "date": "2025-01-15",
  "duration": 60,
  "exercises": [
    {
      "exerciseId": "bench-press",
      "sets": [
        { "reps": 10, "weight": 60 }
      ]
    }
  ],
  "caloriesBurned": 300,
  "notes": "Good session!"
}
```

## Testing Firebase Locally

Use Firebase Emulator Suite for local testing:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

Update `.env` to use emulator:
```bash
VITE_FIREBASE_AUTH_DOMAIN=localhost:9099
```

## Deployment

### Deploy to Firebase Hosting

```bash
# Build production bundle
pnpm build

# Deploy
firebase deploy --only hosting
```

### First-time Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init hosting
```

## Next Steps

- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines
- Explore the codebase structure in main [README.md](../README.md)
- Check out component documentation in `packages/ui/README.md`
- Review shared types in `packages/shared/README.md`
