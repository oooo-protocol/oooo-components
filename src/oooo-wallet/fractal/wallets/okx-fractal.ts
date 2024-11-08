import { NoAlarmException } from 'oooo-components/lib/exception'
import { FractalWallet } from './fractal'

export class OKXFractalWallet extends FractalWallet {
  async getProvider () {
    if (window.okxwallet == null) throw new NoAlarmException('Please install OKX Wallet')
    if (window.okxwallet.fractalBitcoin == null) throw new NoAlarmException('Please upgrade OKX Wallet to the latest version')
    return window.okxwallet.fractalBitcoin
  }

  async switchChain (chainName: string) {
    // ignore switchChain in okx fractal, because okx wallet only support livenet
  }
}
