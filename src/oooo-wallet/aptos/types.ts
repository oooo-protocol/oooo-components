import { type AptosSignMessageOutput, type NetworkInfo } from '@aptos-labs/wallet-standard'
import type { ChainConfig, TransactionParameter, WALLET_TYPE, WalletImpl } from '../types'
import { type PublicKey } from '@aptos-labs/ts-sdk'

export interface AptosWalletImpl extends WalletImpl {
  type: WALLET_TYPE.APTOS
  sign: (message: string) => Promise<AptosSignMessageOutput>
  getPublicKey: () => Promise<PublicKey>
  getNativeBalance: (address: string, config: ChainConfig) => Promise<string>
  transfer: (parameter: TransactionParameter, config: ChainConfig) => Promise<string>
  switchToChain: (network: NetworkInfo) => Promise<void>
}
