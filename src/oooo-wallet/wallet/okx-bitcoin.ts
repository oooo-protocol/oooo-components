import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'

export class OKXBitcoinWallet extends BitcoinWallet {
  get provider () {
    if (window.okxwallet.bitcoin == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet.bitcoin
  }

  async disconnect () {
    try {
      await this.provider.disconnect()
    } catch (e) {}
  }
}
