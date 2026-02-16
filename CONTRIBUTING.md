# Contributing to FitLife

Thank you for your interest in contributing to FitLife! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Accept responsibility and apologize for mistakes

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/fitlife.git
cd fitlife
```

### 2. Set Up Development Environment

Follow the [Setup Guide](docs/setup.md) to configure your development environment.

```bash
# Install dependencies
pnpm install

# Create .env file
cp .env.example .env
# Add your Firebase credentials to .env

# Build all packages
pnpm build

# Start development server
pnpm dev
```

### 3. Create a Branch

Create a new branch for your feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

## Development Process

### 1. Make Your Changes

- Write clean, readable code
- Follow the [Code Style Guidelines](#code-style-guidelines)
- Add or update tests as needed
- Update documentation if necessary

### 2. Test Your Changes

```bash
# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Build all packages
pnpm build

# Test manually in browser
pnpm dev
```

### 3. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add workout filtering by date range"
```

See [Commit Message Conventions](#commit-message-conventions) for details.

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types - avoid `any`
- Use interfaces for object shapes
- Prefer `type` for unions and primitives
- Export types alongside implementation

```typescript
// Good
interface WorkoutLog {
  id: string;
  date: string;
  duration: number;
}

export const createWorkout = (data: WorkoutLog): WorkoutLog => {
  return data;
};

// Bad
export const createWorkout = (data: any) => {
  return data;
};
```

### React Components

- Use functional components with hooks
- Define props interface before component
- Use descriptive prop names
- Destructure props in function signature
- Keep components focused and small

```typescript
// Good
interface WorkoutCardProps {
  workout: WorkoutLog;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const WorkoutCard = ({ workout, onEdit, onDelete }: WorkoutCardProps) => {
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};

// Bad
export const WorkoutCard = (props: any) => {
  return <Card>{/* ... */}</Card>;
};
```

### File Organization

- One component per file
- Co-locate related files (component + styles + tests)
- Use index files for clean exports
- Keep files under 300 lines

```
components/
  WorkoutCard/
    WorkoutCard.tsx
    WorkoutCard.test.tsx
    index.ts
```

### Styling

- Use Tailwind CSS classes
- Use `cn()` utility for conditional classes
- Define custom classes in `tailwind.config.js`
- Avoid inline styles except for dynamic values

```typescript
// Good
import { cn } from '@fitlife/shared';

<div className={cn(
  "rounded-lg p-4",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50"
)} />

// Bad
<div style={{ borderRadius: '8px', padding: '16px' }} />
```

### Imports

- Group imports: React → Third-party → Internal → Types
- Use absolute imports with `@/` prefix for app code
- Use workspace imports `@fitlife/*` for packages
- Sort imports alphabetically within groups

```typescript
// Good
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card } from '@fitlife/ui';
import { WorkoutLog } from '@fitlife/shared';

import { WorkoutCard } from '@/components/WorkoutCard';
import type { WorkoutCardProps } from './types';

// Bad
import { WorkoutCard } from '@/components/WorkoutCard';
import { useState } from 'react';
import type { WorkoutCardProps } from './types';
import { Button } from '@fitlife/ui';
```

### Naming Conventions

- **Components**: PascalCase (`WorkoutCard`)
- **Functions**: camelCase (`calculateCalories`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_WORKOUTS`)
- **Files**: Match export name (`WorkoutCard.tsx`)
- **Types/Interfaces**: PascalCase (`WorkoutLog`)

## Commit Message Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependencies

### Examples

```bash
# Feature
git commit -m "feat(workouts): add filtering by exercise type"

# Bug fix
git commit -m "fix(auth): resolve login redirect loop"

# Documentation
git commit -m "docs: update setup guide with Firebase instructions"

# Refactor
git commit -m "refactor(ui): extract common Button variants"

# Breaking change
git commit -m "feat(api)!: change workout schema structure

BREAKING CHANGE: Workout duration is now in seconds, not minutes"
```

### Scope

Optional scope to specify which part of codebase:
- `auth` - Authentication
- `workouts` - Workout logging
- `nutrition` - Nutrition tracking
- `ui` - UI components
- `api` - API/Firebase
- `build` - Build system
- `ci` - CI/CD

## Pull Request Process

### 1. Push Your Branch

```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to the repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template:
   - Clear title describing the change
   - Description of what changed and why
   - Link related issues
   - Screenshots for UI changes
   - Checklist items completed

### 3. PR Requirements

Before submitting, ensure:

- [ ] Code follows style guidelines
- [ ] All tests pass (`pnpm type-check && pnpm build`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Commit messages follow conventions
- [ ] Documentation is updated (if needed)
- [ ] No merge conflicts with `main`
- [ ] PR description is clear and complete

### 4. Code Review

- Respond to review comments promptly
- Make requested changes in new commits
- Don't force-push after review starts
- Resolve conversations when addressed
- Request re-review when ready

### 5. Merge

Once approved:
- Maintainer will merge your PR
- Branch will be deleted automatically
- Changes will be deployed (if on main)

## Testing

### Type Checking

```bash
pnpm type-check
```

Fix any TypeScript errors before committing.

### Linting

```bash
pnpm lint
```

Most linting issues can be auto-fixed:

```bash
pnpm lint --fix
```

### Manual Testing

Always test your changes manually:

1. Start dev server: `pnpm dev`
2. Test the specific feature/fix
3. Test related features that might be affected
4. Test on different screen sizes (responsive)
5. Check browser console for errors

## Documentation

### When to Update Docs

- Adding new features
- Changing existing behavior
- Adding new packages or configs
- Updating dependencies with breaking changes

### What to Document

- **README.md**: High-level overview, quick start
- **docs/setup.md**: Detailed setup instructions
- **CONTRIBUTING.md**: Development guidelines (this file)
- **Package READMEs**: Package-specific docs
- **Code comments**: Complex logic, workarounds, TODOs

### Documentation Style

- Use clear, concise language
- Include code examples
- Use markdown formatting
- Add links to external resources
- Keep it up to date

## Questions?

If you have questions or need help:

1. Check existing [issues](https://github.com/username/fitlife/issues)
2. Read the [Setup Guide](docs/setup.md)
3. Open a new issue with your question
4. Tag with `question` label

## Thank You!

Your contributions make FitLife better for everyone. We appreciate your time and effort! 🙌
