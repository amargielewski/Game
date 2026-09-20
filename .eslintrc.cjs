module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: ['./tsconfig.json'], sourceType: 'module' },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  ignorePatterns: ['dist', 'node_modules', '*.cjs'],
  rules: {
    'no-warning-comments': [
      'error',
      { terms: ['todo', 'fixme', 'hack', 'xxx'], location: 'anywhere' },
    ],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'id-length': ['error', { min: 2, exceptions: ['x', 'y'] }],
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ObjectPattern',
        message: 'Read objects through their path instead of destructuring them.',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'explicit', overrides: { constructors: 'no-public' } },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/typedef': [
      'error',
      { memberVariableDeclaration: true, variableDeclarationIgnoreFunction: true },
    ],
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreProperties: true }],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'typeLike', format: ['PascalCase'] },
      { selector: 'variable', modifiers: ['const', 'global'], format: ['UPPER_CASE'] },
      {
        selector: 'variable',
        modifiers: ['const', 'global'],
        types: ['function'],
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        modifiers: ['const', 'global'],
        types: ['boolean'],
        format: ['UPPER_CASE'],
        prefix: ['IS_', 'HAS_', 'CAN_', 'SHOULD_'],
      },
      { selector: 'memberLike', format: ['camelCase'] },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'has', 'can', 'should'],
      },
    ],
  },
  overrides: [
    {
      files: ['src/config/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              'pixi.js',
              'zod',
              '**/app/**',
              '**/core/**',
              '**/game/**',
              '**/presentation/**',
            ],
          },
        ],
      },
    },
    {
      files: ['src/storage/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              'pixi.js',
              '**/app/**',
              '**/core/**',
              '**/entities/**',
              '**/scenes/**',
              '**/presentation/**',
            ],
          },
        ],
      },
    },
    {
      files: ['src/core/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: ['zod', '**/app/**', '**/game/**', '**/presentation/**', '**/storage/**'],
          },
        ],
      },
    },
    {
      files: ['src/game/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: ['zod', '**/app/**', '**/presentation/**', '**/storage/**'],
          },
        ],
      },
    },
    {
      files: ['src/game/rules/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              'pixi.js',
              'zod',
              '**/app/**',
              '**/core/**',
              '**/config/**',
              '**/entities/**',
              '**/scenes/**',
              '**/presentation/**',
              '**/storage/**',
            ],
          },
        ],
      },
    },
    {
      files: ['src/presentation/**/*.ts'],
      rules: {
        'no-restricted-imports': ['error', { patterns: ['zod', '**/app/**', '**/core/**'] }],
      },
    },
    {
      files: ['**/*.test.ts'],
      rules: { 'no-restricted-imports': 'off' },
    },
  ],
};
