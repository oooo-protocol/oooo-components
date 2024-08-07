import OKX_IMAGE from './images/okx.png'
import ONEKEY_IMAGE from './images/onekey.png'
import METAMASK_IMAGE from './images/metamask.png'
import UNISAT_IMAGE from './images/unisat.png'
import BYBIT_IMAGE from './images/bybit.png'
import BITGET_IMAGE from './images/bitget.png'
import TOKENPOCKET_IMAGE from './images/tokenpocket.png'
import COIN98_IMAGE from './images/coin98.png'
import { WALLET } from './types'

export const WALLET_CONFIG_MAP = {
  [WALLET.METAMASK]: {
    name: 'METAMASK',
    value: WALLET.METAMASK,
    image: METAMASK_IMAGE
  },
  [WALLET.UNISAT]: {
    name: 'UNISAT',
    value: WALLET.UNISAT,
    image: UNISAT_IMAGE
  },
  [WALLET.OKX]: {
    name: 'OKX WALLET',
    value: WALLET.OKX,
    image: OKX_IMAGE
  },
  [WALLET.OKX_BITCOIN]: {
    name: 'OKX WALLET',
    value: WALLET.OKX_BITCOIN,
    image: OKX_IMAGE
  },
  [WALLET.ONEKEY]: {
    name: 'ONEKEY',
    value: WALLET.ONEKEY,
    image: ONEKEY_IMAGE
  },
  [WALLET.ONEKEY_BITCOIN]: {
    name: 'ONEKEY',
    value: WALLET.ONEKEY_BITCOIN,
    image: ONEKEY_IMAGE
  },
  [WALLET.BYBIT]: {
    name: 'BYBIT',
    value: WALLET.BYBIT,
    image: BYBIT_IMAGE
  },
  [WALLET.BYBIT_BITCOIN]: {
    name: 'BYBIT',
    value: WALLET.BYBIT_BITCOIN,
    image: BYBIT_IMAGE
  },
  [WALLET.BITGET]: {
    name: 'BITGET WALLET',
    value: WALLET.BITGET,
    image: BITGET_IMAGE
  },
  [WALLET.BITGET_BITCOIN]: {
    name: 'BITGET WALLET',
    value: WALLET.BITGET_BITCOIN,
    image: BITGET_IMAGE
  },
  [WALLET.TOKENPOCKET]: {
    name: 'TOKEN POCKET',
    value: WALLET.TOKENPOCKET,
    image: TOKENPOCKET_IMAGE
  },
  [WALLET.COIN98]: {
    name: 'COIN98',
    value: WALLET.COIN98,
    image: COIN98_IMAGE
  }
}

export const BTC_TESTNET_WALLETS = [
  WALLET.UNISAT
]

export const BTC_LIVENET_WALLET = [
  WALLET.UNISAT,
  WALLET.OKX_BITCOIN,
  WALLET.BITGET_BITCOIN,
  WALLET.BYBIT_BITCOIN,
  WALLET.ONEKEY_BITCOIN
]

export const EVM_WALLETS = [
  WALLET.METAMASK,
  WALLET.OKX,
  WALLET.BITGET,
  WALLET.TOKENPOCKET,
  WALLET.BYBIT,
  WALLET.ONEKEY,
  WALLET.COIN98
]
