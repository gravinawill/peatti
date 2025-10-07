import { type ICompareEncryptedPasswordCryptoProvider, type IEncryptPasswordCryptoProvider } from '@peatti/domain'
import { makeLoggerProvider } from '@peatti/logger'

import { BcryptjsPasswordProvider } from './providers/bcryptjs.crypto-provider'

export const makeCryptoProvider = (): ICompareEncryptedPasswordCryptoProvider & IEncryptPasswordCryptoProvider => {
  return new BcryptjsPasswordProvider(makeLoggerProvider())
}
