import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class TokenPocketEthereumWallet extends EthereumWallet {
  async getProvider () {
    // @ts-expect-error token pocket will add isTokenPocket property to window.ethereum
    if (window.ethereum?.isTokenPocket == null) {
      throw new NoAlarmException('Please install TokenPocket Wallet')
    }
    return window.ethereum
  }
}
