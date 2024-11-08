import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'

export class OnekeyEthereumWallet extends EthereumWallet {
  async getProvider () {
    if (window.$onekey?.ethereum == null) {
      throw new NoAlarmException('Please install OneKey Browser Extension at https://onekey.so/download!')
    }
    return window.$onekey.ethereum
  }
}
