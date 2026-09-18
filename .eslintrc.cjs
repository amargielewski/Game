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
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'explicit', overrides: { constructors: 'no-public' } },
    ],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'typeLike', format: ['PascalCase'] },
      { selector: 'variable', modifiers: ['const', 'global'], format: ['UPPER_CASE', 'camelCase'] },
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
      files: ['src/game/rules/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              'pixi.js',
              '**/core/**',
              '**/entities/**',
              '**/scenes/**',
              '**/presentation/**',
              '**/config/GameConfig',
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
              '**/core/**',
              '**/entities/**',
              '**/scenes/**',
              '**/presentation/**',
            ],
          },
        ],
      },
    },
  ],
};
