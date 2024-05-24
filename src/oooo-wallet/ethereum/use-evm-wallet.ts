import { type EthereumWalletImpl, WALLET } from '../types'
import Wrapper from '../wrapper'
import { MetamaskWallet } from '../wallet/metamask'
import { OKXEthereumWallet } from '../wallet/okx-evm'
import { OnekeyEthereumWallet } from '../wallet/onekey-evm'
import { BybitEthereumWallet } from '../wallet/bybit-evm'

const network = import.meta.env.VITE_NETWORK ?? 'livenet'

const wrapper = new Wrapper<EthereumWalletImpl>(
  `oooo-${network}-evm-wallet`,
  {
    [WALLET.METAMASK]: MetamaskWallet,
    [WALLET.OKX]: OKXEthereumWallet,
    [WALLET.ONEKEY]: OnekeyEthereumWallet,
    [WALLET.BYBIT]: BybitEthereumWallet
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
