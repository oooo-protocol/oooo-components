import { NoAlarmException } from 'oooo-components/lib/exception'
import { StandardWallet } from './standard'
import { getAptosWallets, type NetworkInfo } from '@aptos-labs/wallet-standard'

export class RazorWallet extends StandardWallet {
  async getProvider () {
    const wallets = getAptosWallets()
    const aptosWallets = wallets.aptosWallets
    const wallet = aptosWallets.find(wallet => wallet.name === 'Razor Wallet')
    if (!wallet) {
      throw new NoAlarmException('Please install Razor Wallet')
    }
    return wallet
  }

  async switchToChain (networkInfo: NetworkInfo) {
    if (networkInfo.chainId !== 177) {
      throw new Error('Razor Wallet current only support Movement Aptos chain')
    }
  }
}
