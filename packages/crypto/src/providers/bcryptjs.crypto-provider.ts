import {
  type CompareEncryptedPasswordCryptoProviderDTO,
  CryptoProviderMethods,
  type EncryptPasswordCryptoProviderDTO,
  type ICompareEncryptedPasswordCryptoProvider,
  type IEncryptPasswordCryptoProvider,
  type ILoggerProvider,
  Password,
  ProviderError,
  ProvidersNames
} from '@peatti/domain'
import { failure, success } from '@peatti/utils'
import bcrypt from 'bcryptjs'

export class BcryptjsPasswordProvider
  implements ICompareEncryptedPasswordCryptoProvider, IEncryptPasswordCryptoProvider
{
  constructor(private readonly loggerProvider: ILoggerProvider) {}

  public async compareEncryptedPassword(
    parameters: CompareEncryptedPasswordCryptoProviderDTO.Parameters
  ): CompareEncryptedPasswordCryptoProviderDTO.Result {
    try {
      return success({
        isPasswordMatch: await bcrypt.compare(parameters.passwordDecrypted.value, parameters.passwordEncrypted.value)
      })
    } catch (error: unknown) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProvidersNames.CRYPTO,
          method: CryptoProviderMethods.COMPARE_ENCRYPTED_PASSWORD,
          externalName: 'bcryptjs'
        }
      })
      this.loggerProvider.sendLogError({ message: errorProvider.message, error: errorProvider })
      return failure(errorProvider)
    }
  }

  public async encryptPassword(
    parameters: EncryptPasswordCryptoProviderDTO.Parameters
  ): EncryptPasswordCryptoProviderDTO.Result {
    try {
      const hashedPassword = await bcrypt.hash(parameters.password.value, 12)
      const passwordEncrypted = new Password({ password: hashedPassword, isEncrypted: true })
      return success({ passwordEncrypted })
    } catch (error: unknown) {
      const errorProvider = new ProviderError({
        error,
        provider: {
          name: ProvidersNames.CRYPTO,
          method: CryptoProviderMethods.ENCRYPT_PASSWORD,
          externalName: 'bcryptjs'
        }
      })
      this.loggerProvider.sendLogError({ message: errorProvider.message, error: errorProvider })
      return failure(errorProvider)
    }
  }
}
