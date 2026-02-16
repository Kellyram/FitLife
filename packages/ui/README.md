# @fitlife/ui

Shared UI component library for FitLife applications. Built with React, TypeScript, Radix UI primitives, and Tailwind CSS.

## Components

This package includes 8 reusable UI components based on [Shadcn UI](https://ui.shadcn.com/):

- **Avatar** - User avatar with fallback
- **Button** - Clickable button with variants
- **Card** - Container with header, content, and footer
- **Checkbox** - Animated checkbox input
- **Dialog** - Modal dialog with overlay
- **Input** - Text input field
- **Label** - Form label
- **Progress** - Progress bar indicator

## Installation

This package is part of the FitLife monorepo and uses workspace protocol:

```json
{
  "dependencies": {
    "@fitlife/ui": "workspace:*"
  }
}
```

## Usage

### Import Components

```typescript
import { Button, Card, Avatar } from '@fitlife/ui';
```

### Button

```typescript
import { Button } from '@fitlife/ui';

// Default button
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>

// With icon
<Button>
  <Icon className="mr-2" />
  Save Changes
</Button>

// Disabled
<Button disabled>Disabled</Button>

// As link
<Button asChild>
  <a href="/profile">Profile</a>
</Button>
```

### Card

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@fitlife/ui';

<Card>
  <CardHeader>
    <CardTitle>Workout Summary</CardTitle>
    <CardDescription>Your progress this week</CardDescription>
  </CardHeader>
  <CardContent>
    <p>5 workouts completed</p>
  </CardContent>
  <CardFooter>
    <Button>View Details</Button>
  </CardFooter>
</Card>
```

### Avatar

```typescript
import { Avatar, AvatarImage, AvatarFallback } from '@fitlife/ui';

<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="John Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// Custom size
<Avatar className="h-12 w-12">
  <AvatarImage src={user.photoURL} />
  <AvatarFallback>{user.initials}</AvatarFallback>
</Avatar>
```

### Checkbox

```typescript
import { Checkbox } from '@fitlife/ui';

<Checkbox
  id="terms"
  checked={accepted}
  onCheckedChange={setAccepted}
/>
<label htmlFor="terms">Accept terms and conditions</label>
```

### Dialog

```typescript
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@fitlife/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Input

```typescript
import { Input } from '@fitlife/ui';
import { Label } from '@fitlife/ui';

<div>
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="john@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>

// With error state
<Input
  type="password"
  className="border-red-500"
  aria-invalid="true"
/>
```

### Label

```typescript
import { Label } from '@fitlife/ui';

<Label htmlFor="username">Username</Label>
<Input id="username" />

// Required field
<Label htmlFor="password">
  Password <span className="text-red-500">*</span>
</Label>
```

### Progress

```typescript
import { Progress } from '@fitlife/ui';

<Progress value={60} />

// Custom color
<Progress value={progress} className="[&>div]:bg-blue-500" />

// With label
<div>
  <div className="flex justify-between mb-2">
    <span>Progress</span>
    <span>{progress}%</span>
  </div>
  <Progress value={progress} />
</div>
```

## Styling

All components use Tailwind CSS and can be customized with className:

```typescript
// Extend component styles
<Button className="w-full mt-4">
  Full Width Button
</Button>

// Override variants
<Card className="border-blue-500 shadow-lg">
  Custom Card
</Card>
```

## Dependencies

- **React** 18.2 (peer dependency)
- **Radix UI** - Headless UI primitives
- **class-variance-authority** - Variant styling
- **framer-motion** - Animations
- **lucide-react** - Icons
- **@fitlife/shared** - Shared utilities (cn function)

## Development

### Adding New Components

1. Create component file in `src/`:
   ```typescript
   // src/new-component.tsx
   import { cn } from '@fitlife/shared';

   export const NewComponent = ({ className, ...props }) => {
     return <div className={cn("base-styles", className)} {...props} />;
   };
   ```

2. Export from `src/index.ts`:
   ```typescript
   export * from './new-component';
   ```

3. Document usage in this README

### Tailwind Configuration

The package includes its own Tailwind config (`tailwind.config.ts`) that extends the base theme.

**Important**: When using these components in an app, add the UI package path to the app's Tailwind content:

```javascript
// apps/web/tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}', // Include UI package
  ],
  // ...
};
```

## TypeScript

All components are fully typed with TypeScript. Import types as needed:

```typescript
import type { ButtonProps } from '@fitlife/ui';

const MyButton: React.FC<ButtonProps> = (props) => {
  return <Button {...props} />;
};
```

## Accessibility

Components follow accessibility best practices:

- Semantic HTML elements
- Proper ARIA attributes
- Keyboard navigation support
- Focus management
- Screen reader support

## Examples

See component usage examples in the main FitLife app:

- **Button**: `apps/web/src/components/dashboard/DashboardHeader.tsx`
- **Card**: `apps/web/src/pages/DashboardPage.tsx`
- **Dialog**: `apps/web/src/pages/LoginPage.tsx` (Forgot Password)
- **Input**: `apps/web/src/pages/LoginPage.tsx`
- **Checkbox**: `apps/web/src/pages/LoginPage.tsx` (Remember Me)

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new components.
