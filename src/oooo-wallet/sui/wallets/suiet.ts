import { NoAlarmException } from 'oooo-components/lib/exception'
import { StandardWallet } from './standard'
import { getWallets } from '@mysten/wallet-standard'

export class SuietWallet extends StandardWallet {
  async getProvider () {
    const wallets = getWallets().get()
    const wallet = wallets.find(wallet => wallet.name === 'Suiet')
    if (!wallet) {
      throw new NoAlarmException('Please install Suiet Wallet')
    }
    return wallet
  }
}
