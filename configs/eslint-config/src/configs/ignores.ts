import { type FlatConfig } from '../types'

export const ignores = (userIgnores: string[] = []): FlatConfig[] => [
  {
    name: 'peatti/ignores',
    ignores: [...userIgnores]
  }
]
