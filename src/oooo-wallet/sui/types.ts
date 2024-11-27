import type { TransactionParameter, WALLET_TYPE, WalletImpl } from '../types'

export interface AptosTokenConfig {
  function: string
  coinType?: string
  decimals: number
}

export interface AptosTokenConfigWithRpc extends AptosTokenConfig {
  chainRpcUrl: string
}

export interface SuiWalletImpl extends WalletImpl {
  type: WALLET_TYPE.SUI
  sign: (message: string) => Promise<string>
  getPublicKey: () => Promise<PublicKey>
  getBalance: (address: string, config: AptosTokenConfigWithRpc) => Promise<string>
  transfer: (parameter: TransactionParameter, config: AptosTokenConfig) => Promise<string>
  switchToChain: (network: Network) => Promise<void>
}
