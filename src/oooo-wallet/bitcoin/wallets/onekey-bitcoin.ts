import { NoAlarmException } from 'oooo-components/lib/exception'
import { BitcoinWallet } from './bitcoin'

export class OnekeyBitcoinWallet extends BitcoinWallet {
  async getProvider () {
    if (window.$onekey?.btc == null) {
      throw new NoAlarmException('Please install OneKey Browser Extension at https://onekey.so/download!')
    }
    return window.$onekey.btc
  }
}
