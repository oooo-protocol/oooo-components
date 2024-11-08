import { WALLET, type BitcoinWalletImpl } from '../types'
import Wrapper from '../wrapper'
import { OKXBitcoinWallet } from './wallets/okx-bitcoin'
import { UnisatWallet } from './wallets/unisat'
import { BybitBitcoinWallet } from './wallets/bybit-bitcoin'
import { OnekeyBitcoinWallet } from './wallets/onekey-bitcoin'
import { BitgetBitcoinWallet } from './wallets/bitget-bitcoin'

const wrapper = new Wrapper<BitcoinWalletImpl>(
  'oooo-btc-wallet',
  {
    [WALLET.OKX_BITCOIN]: OKXBitcoinWallet,
    [WALLET.UNISAT]: UnisatWallet,
    [WALLET.ONEKEY_BITCOIN]: OnekeyBitcoinWallet,
    [WALLET.BYBIT_BITCOIN]: BybitBitcoinWallet,
    [WALLET.BITGET_BITCOIN]: BitgetBitcoinWallet
  }
)

export const useBTCWallet = () => {
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
