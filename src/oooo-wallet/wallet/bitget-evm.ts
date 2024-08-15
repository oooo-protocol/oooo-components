import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class BitgetEthereumWallet extends EthereumWallet {
  async getProvider () {
    if (window.bitkeep?.ethereum == null) {
      throw new NoAlarmException('Please install Bitget Wallet')
    }
    return window.bitkeep.ethereum
  }
}
