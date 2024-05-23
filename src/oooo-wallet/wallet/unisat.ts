import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'
import { type onAccountChangedEvent } from '../types'

export class UnisatWallet extends BitcoinWallet {
  get provider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    this.provider.on('accountsChanged', (accounts: string[]) => {
      event(accounts[0])
    })
  }
}
