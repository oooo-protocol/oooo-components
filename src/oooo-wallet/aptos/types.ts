import { type AptosSignMessageOutput, type NetworkInfo } from '@aptos-labs/wallet-standard'
import type { TransactionParameter, WALLET_TYPE, WalletImpl } from '../types'
import { type PublicKey } from '@aptos-labs/ts-sdk'

export interface AptosTokenConfig {
  function: string
  coinType?: string
  decimals: number
}

export interface AptosTokenConfigWithRpc extends AptosTokenConfig {
  chainRpcUrl: string
}

export interface AptosWalletImpl extends WalletImpl {
  type: WALLET_TYPE.APTOS
  sign: (message: string) => Promise<AptosSignMessageOutput>
  getPublicKey: () => Promise<PublicKey>
  getBalance: (address: string, config: AptosTokenConfigWithRpc) => Promise<string>
  transfer: (parameter: TransactionParameter, config: AptosTokenConfig) => Promise<string>
  switchToChain: (network: NetworkInfo) => Promise<void>
}
