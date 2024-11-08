import { NoAlarmException } from 'oooo-components/lib/exception'
import { StandardWallet } from './standard'
import { getAptosWallets } from '@aptos-labs/wallet-standard'

export class NightlyWallet extends StandardWallet {
  async getProvider () {
    const wallets = getAptosWallets()
    const aptosWallets = wallets.aptosWallets
    const wallet = aptosWallets.find(wallet => wallet.name === 'Nightly')
    if (!wallet) {
      throw new NoAlarmException('Please install Nightly Wallet')
    }
    return wallet
  }
}
