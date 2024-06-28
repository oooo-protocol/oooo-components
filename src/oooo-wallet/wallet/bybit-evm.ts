import { NoAlarmException } from 'oooo-components/lib/exception'
import { EthereumWallet } from './ethereum'
import { ethers, type TransactionRequest } from 'ethers'
import { type TransactionParameter, type ChainConfig } from '../types'

export class BybitEthereumWallet extends EthereumWallet {
  get provider () {
    if (window.bybitWallet == null) {
      throw new NoAlarmException('Please install Bybit Wallet')
    }
    return window.bybitWallet
  }

  /**
   * Override ethereum's transfer function to fix bybit `chainId should be same as current chainId` error;
   * No found any reason, and chainId is same as current bybit wallet chain, so we decide
   * remove `chainId` param in bybit transfer function
   */
  async transfer (parameter: TransactionParameter, config: ChainConfig) {
    const provider = new ethers.BrowserProvider(this.provider)
    try {
      const signer = await provider.getSigner()
      const params: TransactionRequest = {
        gasPrice: parameter.gas,
        to: parameter.to,
        from: parameter.from,
        value: ethers.parseUnits(parameter.value, config.nativeCurrency.decimals)
      }
      const gasLimit = await provider.estimateGas(params)
      params.gasLimit = gasLimit
      console.log('eth_sendTransaction', params)
      const { hash } = await signer.sendTransaction(params)
      return hash
    } finally {
      provider.destroy()
    }
  }
}
