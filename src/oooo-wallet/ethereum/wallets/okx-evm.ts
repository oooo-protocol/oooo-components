import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class OKXEthereumWallet extends EthereumWallet {
  async getProvider () {
    if (window.okxwallet == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet
  }
}
