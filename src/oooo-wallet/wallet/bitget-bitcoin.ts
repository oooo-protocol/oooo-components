import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { Network, validate } from 'bitcoin-address-validation'

export class BitgetBitcoinWallet extends BitcoinWallet {
  async getProvider () {
    if (window.bitkeep == null) {
      throw new NoAlarmException('Please install Bitget Wallet')
    }
    if (window.bitkeep.unisat == null) {
      throw new NoAlarmException('Please upgrade Bitget Wallet to support Bitcoin chain')
    }
    return window.bitkeep.unisat
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
