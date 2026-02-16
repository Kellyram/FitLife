# FitLife - Fitness Tracking Application

A modern, production-ready fitness tracking application built with React, TypeScript, and Firebase. FitLife helps users log workouts, track progress, manage nutrition, and connect with a fitness community.

## Tech Stack

- **Frontend Framework**: React 18.2 with TypeScript 5.3
- **Build Tool**: Vite 5.4 with Hot Module Replacement (HMR)
- **Styling**: Tailwind CSS 3.4 with custom theme and animations
- **UI Components**: Radix UI primitives with Shadcn components
- **State Management**: Zustand for client state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Routing**: React Router v7
- **Monorepo**: Turborepo with pnpm workspaces
- **CI/CD**: GitHub Actions with Firebase Hosting

## Project Structure

```
fitlife/
├── .github/
│   ├── workflows/          # CI/CD workflows (ci, deploy, preview)
│   ├── ISSUE_TEMPLATE/     # Bug report & feature request templates
│   └── CODEOWNERS          # Code ownership definitions
├── apps/
│   └── web/               # Main React application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components
│       │   ├── context/     # React contexts (Auth, Theme)
│       │   ├── hooks/       # Custom React hooks
│       │   ├── store/       # Zustand stores
│       │   ├── lib/         # Firebase & utilities
│       │   └── styles/      # Global styles
│       └── public/          # Static assets
├── packages/
│   ├── ui/                # Shared UI component library
│   │   └── src/           # 8 Shadcn components (Avatar, Button, Card, etc.)
│   ├── shared/            # Shared types, utilities, schemas
│   │   └── src/
│   │       ├── types/     # Domain types (Exercise, WorkoutLog, etc.)
│   │       └── utils/     # Shared utilities (cn function)
│   ├── typescript-config/ # Shared TypeScript configurations
│   │   ├── base.json      # Base config
│   │   ├── react.json     # React-specific config
│   │   └── node.json      # Node-specific config
│   └── eslint-config/     # Shared ESLint configuration
├── docs/
│   └── setup.md           # Detailed setup guide
├── turbo.json             # Turborepo configuration
├── firebase.json          # Firebase Hosting config
├── .firebaserc            # Firebase project settings
├── .env.example           # Environment variable template
├── pnpm-workspace.yaml    # pnpm workspace configuration
└── package.json           # Root package.json with scripts
```

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- pnpm 10.x (install with `npm install -g pnpm`)
- Firebase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitlife
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Firebase configuration values from the Firebase Console.

4. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

Run these commands from the root directory:

- **`pnpm dev`** - Start development server for all apps
- **`pnpm build`** - Build all packages and apps for production
- **`pnpm lint`** - Run ESLint across all packages
- **`pnpm type-check`** - Run TypeScript type checking
- **`pnpm clean`** - Clean all build artifacts and node_modules
- **`pnpm format`** - Format code with Prettier

### Package-specific scripts

Run scripts for a specific package using `-F` filter:

```bash
pnpm -F web dev          # Run dev server for web app only
pnpm -F web build        # Build web app only
pnpm -F @fitlife/ui build  # Build UI package only
```

## Development

### Adding New UI Components

1. Create component in `packages/ui/src/`
2. Export from `packages/ui/src/index.ts`
3. Use in web app: `import { ComponentName } from '@fitlife/ui'`

### Adding Shared Types

1. Add type to `packages/shared/src/types/index.ts`
2. Export from `packages/shared/src/index.ts`
3. Use in any package: `import { TypeName } from '@fitlife/shared'`

### Working with Firebase

All Firebase configuration is in `apps/web/src/lib/firebase.ts`. The app uses:
- **Authentication**: Email/password auth with session persistence
- **Firestore**: Document-based database for user data, workouts, nutrition logs
- **Storage**: File storage for profile photos and workout images
- **Functions**: Serverless functions for backend logic (if needed)

## Deployment

### Firebase Hosting

The app automatically deploys to Firebase Hosting via GitHub Actions:

- **Production**: Push to `main` branch → Deploys to live site
- **Preview**: Open PR → Creates preview channel (expires in 7 days)

### Manual Deployment

```bash
# Build for production
pnpm build

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy --only hosting
```

## GitHub Secrets Configuration

To enable CI/CD, add these secrets in GitHub repository settings:

- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
- `VITE_FIREBASE_API_KEY` - Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID` - Firebase app ID
- `VITE_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID

## Features

- 🔐 **Authentication**: Secure email/password auth with Firebase
- 💪 **Workout Logging**: Track exercises, sets, reps, and duration
- 📊 **Progress Tracking**: Visualize workout history and achievements
- 🍎 **Nutrition Tracking**: Log meals and monitor calorie intake
- 👥 **Community**: Share progress and connect with other users
- 📱 **Responsive Design**: Mobile-first, works on all devices
- 🎨 **Modern UI**: Beautiful glassmorphic design with smooth animations
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ⚡ **Performance**: Optimized with Vite and Turborepo caching

## Package Development

### @fitlife/ui

Shared UI component library with 8 Shadcn components. See [`packages/ui/README.md`](packages/ui/README.md) for details.

### @fitlife/shared

Shared types, utilities, and schemas. See [`packages/shared/README.md`](packages/shared/README.md) for details.

### @fitlife/typescript-config

Shared TypeScript configurations for consistent compilation across packages.

### @fitlife/eslint-config

Shared ESLint configuration with React and TypeScript rules.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development process, code style guidelines, and how to submit pull requests.

## Troubleshooting

See [docs/setup.md](docs/setup.md) for common issues and solutions.

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Open an issue using our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Request features using our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
