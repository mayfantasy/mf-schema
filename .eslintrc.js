module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks'
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  rules: {
    indent: 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/camelcase': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
