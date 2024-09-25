import { EthereumWallet } from './ethereum'
import { getProvider } from '@binance/w3w-ethereum-provider'
import { Buffer } from 'buffer'
import { type ChainConfig } from '../types'

// fix @binance/w3w-ethereum-provider dependence Nodejs Buffer api error
if (window.Buffer == null) {
  window.Buffer = Buffer
}

export class BinanceEthereumWallet extends EthereumWallet {
  async getProvider () {
    const provider = getProvider({
      chainId: 1
    })
    return provider
  }

  async switchToChain (config: ChainConfig) {
    const provider = await this.getProvider()
    if (provider.chainId === config.chainId) return
    await super.switchToChain(config)
  }
}
