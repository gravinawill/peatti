import { regexpPlugin } from '../plugins'
import { type FlatConfig, type RuleOverrides } from '../types'

export const regexp = (overrides?: RuleOverrides): FlatConfig[] => [
  {
    name: 'peatti/regexp/rules',
    plugins: {
      regexp: regexpPlugin
    },
    rules: {
      ...regexpPlugin.configs['flat/recommended'].rules,

      ...overrides
    }
  }
]
