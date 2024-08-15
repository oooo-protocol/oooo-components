import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { Network, validate } from 'bitcoin-address-validation'

export class BybitBitcoinWallet extends BitcoinWallet {
  async getProvider () {
    if (window.bybitWallet == null) {
      throw new NoAlarmException('Please install Bybit Wallet')
    }
    if (window.bybitWallet.bitcoin == null) {
      throw new NoAlarmException('Please upgrade Bybit Wallet to support Bitcoin chain')
    }
    return window.bybitWallet.bitcoin
  }

  onAccountsChanged (accounts: string[]) {
    const account = accounts[0]

    this.accountChangedEvents.forEach(event => {
      if (validate(account, Network.mainnet)) {
        event(account)
      } else {
        event(undefined)
      }
    })
  }
}
