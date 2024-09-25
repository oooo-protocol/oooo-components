import { NoAlarmException } from 'oooo-components/lib/exception'
import { FractalWallet } from './fractal'

export class UnisatFractalWallet extends FractalWallet {
  async getProvider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }
}
