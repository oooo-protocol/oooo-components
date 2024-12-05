import { type IdentifierString } from '@mysten/wallet-standard'
import type { TransactionParameter, WALLET_TYPE, WalletImpl } from '../types'

export interface SuiTokenConfig {
  coinType: string
  chain: IdentifierString
  decimals: number
}

export interface SuiTokenConfigWithRpc extends SuiTokenConfig {
  chainRpcUrl: string
}

export interface SuiWalletImpl extends WalletImpl {
  type: WALLET_TYPE.SUI
  sign: (message: string) => Promise<string>
  getPublicKey: () => Promise<string>
  getBalance: (address: string, config: SuiTokenConfigWithRpc) => Promise<string>
  transfer: (parameter: TransactionParameter, config: SuiTokenConfigWithRpc) => Promise<string>
  estimateGas: (parameter: TransactionParameter, config: SuiTokenConfigWithRpc) => Promise<string>
}
