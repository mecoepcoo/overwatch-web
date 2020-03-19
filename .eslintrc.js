module.exports = {
  'root': true,
  'parser': '@typescript-eslint/parser',
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'plugins': ['@typescript-eslint'],
  'rules': {
    'semi': [2, 'never'],
    'no-extra-semi': 2,
    'prefer-const': 0,
    'no-prototype-builtins': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}
