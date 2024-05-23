import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class OKXEthereumWallet extends EthereumWallet {
  get provider () {
    if (window.okxwallet == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.okxwallet
  }
}
