import baseConfig from '@fitlife/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['tailwind.config.js', 'postcss.config.js', 'vite.config.ts'],
  },
];
