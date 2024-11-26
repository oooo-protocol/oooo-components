import { NoAlarmException } from 'oooo-components/lib/exception'
import { StandardWallet } from './standard'
import { getAptosWallets, type NetworkInfo } from '@aptos-labs/wallet-standard'

export class OKXWallet extends StandardWallet {
  async getProvider () {
    const wallets = getAptosWallets()
    const aptosWallets = wallets.aptosWallets
    const wallet = aptosWallets.find(wallet => wallet.name === 'OKX Wallet')
    if (!wallet) {
      throw new NoAlarmException('Please install OKX Wallet')
    }
    return wallet
  }

  async switchToChain (networkInfo: NetworkInfo) {
    console.log('switchToChain', networkInfo)
    const currentNetwork = await this._standardAptosWallet.features['aptos:network'].network()
    console.log(currentNetwork)
    if (currentNetwork.chainId === networkInfo.chainId) return
    const feature = this._standardAptosWallet.features['aptos:changeNetwork']
    if (!feature) {
      throw new Error(`The wallet does not support switch chain, please go to the wallet to switch to the ${networkInfo.name} chain`)
    }

    await feature.changeNetwork(networkInfo)
  }
}
