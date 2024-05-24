export enum WALLET {
  METAMASK,
  OKX,
  UNISAT,
  OKX_BITCOIN,
  ONEKEY,
  ONEKEY_BITCOIN,
  BYBIT
}

export enum WALLET_TYPE {
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum'
}

export enum NETWORK {
  LIVENET = 'livenet',
  TESTNET = 'testnet'
}

export interface ChainConfig {
  chainId: string
  chainName: string
  rpcUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorerUrls: string[]
}

export interface TransactionParameter {
  from: string
  to: string
  value: string
  gas: string
}

export type onAccountChangedEvent = (account?: string) => void

export interface WalletImpl {
  type: WALLET_TYPE
  provider: any
  getAccounts: () => Promise<string[]>
  connect: () => Promise<string>
  disconnect: () => Promise<void>
  sign: (message: string, from: string) => Promise<string>
  onAccountChanged: (event: onAccountChangedEvent) => void
}

export interface EthereumWalletImpl extends WalletImpl {
  type: WALLET_TYPE.ETHEREUM
  getNativeBalance: (address: string, rpc: string) => Promise<string>
  getTokenBalance: (address: string, rpc: string, contractAddress: string) => Promise<string>
  transfer: (parameter: TransactionParameter, chain: ChainConfig) => Promise<string>
  tokenTransfer: (parameter: TransactionParameter, chain: ChainConfig, contractAddress: string) => Promise<string>
  switchToChain: (config: ChainConfig) => Promise<void>
}

export interface BitcoinWalletImpl extends WalletImpl {
  type: WALLET_TYPE.BITCOIN
  getPublicKey: () => Promise<string>
  getNativeBalance: () => Promise<string>
  transfer: (parameter: TransactionParameter) => Promise<string>
  switchNetwork: (network: NETWORK) => Promise<void>
}

export type WalletConstructor = new () => WalletImpl
