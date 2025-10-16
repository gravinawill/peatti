import { defineConfig } from '@peatti/eslint-config'

export default defineConfig(
  {},
  {
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      'sonarjs/todo-tag': 'off'
    }
  }
)
