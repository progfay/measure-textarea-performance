module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'standard',
    'standard-with-typescript'
  ],
  plugins: [],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/prefer-nullish-coalescing': 0
  },
  globals: {},
  parserOptions: {
    project: './tsconfig.json'
  }
}