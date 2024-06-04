import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { type onAccountChangedEvent } from '../types'
import { Network, validate } from 'bitcoin-address-validation'

export class BitgetBitcoinWallet extends BitcoinWallet {
  get provider () {
    if (window.bitkeep == null) {
      throw new NoAlarmException('Please install Bitget Wallet')
    }
    if (window.bitkeep.unisat == null) {
      throw new NoAlarmException('Please upgrade Bitget Wallet to support Bitcoin chain')
    }
    return window.bitkeep.unisat
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountsChanged', (accounts: string[]) => {
      const account = accounts[0]
      if (validate(account, Network.mainnet)) {
        event(account)
      } else {
        event(undefined)
      }
    })
  }
}
