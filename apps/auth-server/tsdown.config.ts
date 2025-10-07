import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/server.ts',
  format: 'module',
  noExternal: [
    '@peatti/crypto',
    '@peatti/domain',
    '@peatti/env',
    '@peatti/logger',
    '@peatti/eslint-config',
    '@peatti/typescript-config',
    '@peatti/utils'
  ],
  platform: 'node',
  alias: {
    '@use-cases/*': './src/app/use-cases/*',
    '@controllers/*': './src/app/controllers/*',
    '@factories/*': './src/main/factories/*',
    '@models/*': './src/domain/models/*',
    '@contracts/*': './src/domain/contracts/*',
    '@infra/*': './src/infra/*'
  },
  unbundle: false,
  external: [
    // Keep Prisma client external to avoid bundling issues with binary engines
    '@prisma/client',
    'prisma/generated/runtime',
    'prisma/generated/runtime/binary'
  ],
  // Define globals for ES module compatibility
  define: {
    __dirname: 'import.meta.url ? new URL(".", import.meta.url).pathname : undefined',
    __filename: 'import.meta.url ? new URL(import.meta.url).pathname : undefined'
  }
})
