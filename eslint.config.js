// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import perfectionist from 'eslint-plugin-perfectionist'

export default tseslint.config(
  {
    ignores: ['**/*.js'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  perfectionist.configs['recommended-natural']
)
