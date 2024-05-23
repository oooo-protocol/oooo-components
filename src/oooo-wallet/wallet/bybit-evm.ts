import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

class BybitEthereumWallet extends EthereumWallet {
  get provider () {
    if (window.bybitWallet == null) {
      throw new NoAlarmException('Please install Bybit Wallet')
    }
    return window.bybitWallet
  }
}

export default new BybitEthereumWallet()
