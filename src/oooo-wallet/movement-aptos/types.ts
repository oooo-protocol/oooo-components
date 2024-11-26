import { type AptosSignMessageOutput, type NetworkInfo } from '@aptos-labs/wallet-standard'
import type { TransactionParameter, WALLET_TYPE, WalletImpl } from '../types'
import { type PublicKey } from '@aptos-labs/ts-sdk'
import { type AptosTokenConfig, type AptosTokenConfigWithRpc } from '../aptos/types'

export interface MovementAptosWalletImpl extends WalletImpl {
  type: WALLET_TYPE.MOVEMENT_APTOS
  sign: (message: string) => Promise<AptosSignMessageOutput>
  getPublicKey: () => Promise<PublicKey>
  getBalance: (address: string, config: AptosTokenConfigWithRpc) => Promise<string>
  transfer: (parameter: TransactionParameter, config: AptosTokenConfig) => Promise<string>
  switchToChain: (network: NetworkInfo) => Promise<void>
}
