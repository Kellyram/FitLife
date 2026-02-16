# @fitlife/typescript-config

Shared TypeScript configurations for the FitLife monorepo.

## Usage

In your `tsconfig.json`:

```json
{
  "extends": "@fitlife/typescript-config/react.json",
  "compilerOptions": {
    // Your overrides
  }
}
```

## Configs

- `base.json` - Base configuration
- `react.json` - For React applications
- `node.json` - For Node.js packages
