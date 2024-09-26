import { EthereumWallet } from './ethereum'
import { getProvider } from '@binance/w3w-ethereum-provider'
import { Buffer } from 'buffer'
import { type ChainConfig } from '../types'
import { HttpClient } from '@binance/w3w-http-client'

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
    if (provider.chainId !== config.chainId) {
      await super.switchToChain(config)
    }
    /**
     * fix @binance/w3w-ethereum-provider not record rpc when switch chain
     * cause @binance/w3w-ethereum-provider inner httpClient init failed error
     */
    this.provider.httpClient = new HttpClient(config.rpcUrls[0])
  }
}
