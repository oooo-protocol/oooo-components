import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'

export class OKXBitcoinWallet extends BitcoinWallet {
  onAccountChangedEventName = 'accountChanged'

  async getProvider () {
    if (window.okxwallet.bitcoin == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet.bitcoin
  }

  async connect () {
    const accounts = await this.provider.requestAccounts()
    const account = accounts[0]
    if (account == null) {
      throw new Error('Unable to access wallet account')
    }
    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountChanged.bind(this)
      this.provider.on(this.onAccountChangedEventName, this._onAccountsChanged)
    }

    return account as string
  }

  onAccountChanged (account?: {
    address: string
    publicKey: string
    compressedPublicKey: string
  }) {
    if (account) {
      super.onAccountsChanged([account.address])
    }
  }
}
