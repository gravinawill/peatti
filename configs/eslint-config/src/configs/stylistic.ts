import { stylisticPlugin } from '../plugins'
import { type FlatConfig, type RuleOverrides } from '../types'

export const stylistic = (overrides?: RuleOverrides): FlatConfig[] => [
  {
    name: 'peatti/stylistic/rules',
    plugins: {
      '@stylistic': stylisticPlugin
    },
    rules: {
      '@stylistic/multiline-comment-style': 'error',

      ...overrides
    }
  }
]
