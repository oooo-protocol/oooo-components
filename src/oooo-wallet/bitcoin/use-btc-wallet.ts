import { WALLET, type BitcoinWalletImpl } from '../types'
import Wrapper from '../wrapper'
import { OKXBitcoinWallet } from '../wallet/okx-bitcoin'
import { UnisatWallet } from '../wallet/unisat'

const wrapper = new Wrapper<BitcoinWalletImpl>(
  'oooo-btc-wallet',
  {
    [WALLET.OKX_BITCOIN]: OKXBitcoinWallet,
    [WALLET.UNISAT]: UnisatWallet
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
