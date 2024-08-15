import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class Coin98EthereumWallet extends EthereumWallet {
  getProvider () {
    if (window.coin98 == null) throw new NoAlarmException('Please install Coin98 Wallet')
    return window.coin98.provider
  }
}
