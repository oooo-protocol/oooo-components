import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'

export class UnisatWallet extends BitcoinWallet {
  async getProvider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }

  async switchChain (chainName: string) {
    await this.provider.switchChain(chainName)
  }
}
