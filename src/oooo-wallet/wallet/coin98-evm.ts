import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class Coin98EthereumWallet extends EthereumWallet {
  get provider () {
    if (window.coin98 == null) throw new NoAlarmException('Please install OKX Wallet')
    return window.coin98.provider
  }
}
