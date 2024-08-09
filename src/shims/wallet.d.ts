import type { Eip1193Provider, BrowserProvider } from 'ethers'

declare global {
  interface Window {
    ethereum?: BrowserProvider & Eip1193Provider
    okxwallet?: any
    unisat?: any
    $onekey?: any
    bybitWallet?: any
    bitkeep?: any
    coin98?: any
    DEFINE_APP_VERSION: string
  }
}
