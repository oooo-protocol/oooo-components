import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter, type NETWORK, type BitcoinWalletImpl } from '../types'
import { Decimal } from 'decimal.js-light'

export class BitcoinWallet implements BitcoinWalletImpl {
  readonly type = WALLET_TYPE.BITCOIN

  get provider (): any {
    throw new Error('Provider not config, please check it')
  }

  async getAccounts () {
    return this.provider.getAccounts() as string[]
  }

  async getNativeBalance () {
    const balance = await this.provider.getBalance()
    return (balance.confirmed * Math.pow(10, -8)).toString()
  }

  async connect () {
    const accounts = await this.provider.requestAccounts()
    const account = accounts[0]
    if (account == null) {
      throw new Error('Unable to access wallet account')
    }
    return account as string
  }

  async disconnect () {
    void this.provider.removeAllListeners()
  }

  async sign (message: string) {
    const signature = await this.provider.signMessage(message)
    return signature
  }

  async getPublicKey () {
    return this.provider.getPublicKey()
  }

  async switchNetwork (network: NETWORK) {
    const currentNetwork = await this.provider.getNetwork()
    if (currentNetwork !== network) {
      await this.provider.switchNetwork(network)
    }
  }

  async transfer (parameter: TransactionParameter) {
    return this.provider.sendBitcoin(
      parameter.to,
      Number(new Decimal(parameter.value).mul(new Decimal(10).pow(8))),
      {
        feeRate: parameter.gas
      }
    )
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountChanged', (account?: {
      address: string
      publicKey: string
      compressedPublicKey: string
    }) => {
      event(account?.address)
    })
  }
}
