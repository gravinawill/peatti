import globals from 'globals'

import { playwrightPlugin } from '../plugins'
import { type FlatConfig, type RuleOverrides } from '../types'

export const playwright = (glob: string, overrides?: RuleOverrides): FlatConfig[] => [
  {
    name: 'peatti/playwright/setup',
    languageOptions: {
      globals: globals['shared-node-browser']
    }
  },
  {
    name: 'peatti/playwright/rules',
    files: [glob],
    plugins: {
      playwright: playwrightPlugin
    },
    rules: {
      ...playwrightPlugin.configs.recommended.rules,

      ...overrides
    }
  }
]
