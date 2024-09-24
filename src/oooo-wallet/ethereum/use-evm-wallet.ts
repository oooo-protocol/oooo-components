import { type EthereumWalletImpl, WALLET } from '../types'
import Wrapper from '../wrapper'
import { MetamaskWallet } from '../wallet/metamask'
import { OKXEthereumWallet } from '../wallet/okx-evm'
import { OnekeyEthereumWallet } from '../wallet/onekey-evm'
import { BybitEthereumWallet } from '../wallet/bybit-evm'
import { BitgetEthereumWallet } from '../wallet/bitget-evm'
import { TokenPocketEthereumWallet } from '../wallet/tokenpocket-evm'
import { Coin98EthereumWallet } from '../wallet/coin98-evm'
import { WalletConnectWallet } from '../wallet/wallet-connect'
import { BinanceEthereumWallet } from '../wallet/binance-evm'

const wrapper = new Wrapper<EthereumWalletImpl>(
  'oooo-evm-wallet',
  {
    [WALLET.METAMASK]: MetamaskWallet,
    [WALLET.OKX]: OKXEthereumWallet,
    [WALLET.ONEKEY]: OnekeyEthereumWallet,
    [WALLET.BYBIT]: BybitEthereumWallet,
    [WALLET.BITGET]: BitgetEthereumWallet,
    [WALLET.TOKENPOCKET]: TokenPocketEthereumWallet,
    [WALLET.COIN98]: Coin98EthereumWallet,
    [WALLET.WALLETCONNCET]: WalletConnectWallet,
    [WALLET.BINANCE]: BinanceEthereumWallet
  }
)

export const useEVMWallet = () => {
  const getWalletInstance = () => {
    return wrapper.instance
  }

  const onConnect = async (name: WALLET) => {
    await wrapper.onConnect(name)
  }

  const onLogout = async () => {
    await wrapper.onLogout()
  }

  return {
    name: wrapper.name,
    address: wrapper.address,
    getWalletInstance,
    onConnect,
    onLogout
  }
}
