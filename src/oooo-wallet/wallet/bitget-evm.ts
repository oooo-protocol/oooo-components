import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class BitgetEthereumWallet extends EthereumWallet {
  get provider () {
    if (window.bitkeep.ethereum == null) {
      throw new NoAlarmException('Please install Bitget Wallet')
    }
    return window.bitkeep.ethereum
  }
}
