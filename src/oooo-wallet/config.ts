import OKX_IMAGE from './images/okx.png'
import ONEKEY_IMAGE from './images/onekey.png'
import METAMASK_IMAGE from './images/metamask.png'
import UNISAT_IMAGE from './images/unisat.png'
import BYBIT_IMAGE from './images/bybit.png'
import BITGET_IMAGE from './images/bitget.png'
import TOKENPOCKET_IMAGE from './images/tokenpocket.png'
import COIN98_IMAGE from './images/coin98.png'
import WALLETCONNCET_IMAGE from './images/walletconnect.png'
import BINANCE_IMAGE from './images/binance.png'
import NIGHTLY_IMAGE from './images/nightly.png'
import RAZOR_IMAGE from './images/razor.png'
import MARTIAN_IMAGE from './images/martian.png'
import { WALLET } from './types'
import { defineMap } from '@preflower/utils'

export const WALLETS = [
  {
    name: 'METAMASK',
    value: WALLET.METAMASK,
    image: METAMASK_IMAGE
  },
  {
    name: 'UNISAT',
    value: WALLET.UNISAT,
    image: UNISAT_IMAGE
  },
  {
    name: 'OKX WALLET',
    value: WALLET.OKX,
    image: OKX_IMAGE
  },
  {
    name: 'OKX WALLET',
    value: WALLET.OKX_BITCOIN,
    image: OKX_IMAGE
  },
  {
    name: 'ONEKEY',
    value: WALLET.ONEKEY,
    image: ONEKEY_IMAGE
  },
  {
    name: 'ONEKEY',
    value: WALLET.ONEKEY_BITCOIN,
    image: ONEKEY_IMAGE
  },
  {
    name: 'BYBIT',
    value: WALLET.BYBIT,
    image: BYBIT_IMAGE
  },
  {
    name: 'BYBIT',
    value: WALLET.BYBIT_BITCOIN,
    image: BYBIT_IMAGE
  },
  {
    name: 'BITGET WALLET',
    value: WALLET.BITGET,
    image: BITGET_IMAGE
  }, {
    name: 'BITGET WALLET',
    value: WALLET.BITGET_BITCOIN,
    image: BITGET_IMAGE
  },
  {
    name: 'TOKEN POCKET',
    value: WALLET.TOKENPOCKET,
    image: TOKENPOCKET_IMAGE
  },
  {
    name: 'COIN98',
    value: WALLET.COIN98,
    image: COIN98_IMAGE
  },
  {
    name: 'WALLET CONNECT',
    value: WALLET.WALLETCONNCET,
    image: WALLETCONNCET_IMAGE
  },
  {
    name: 'BINANCE WALLET',
    value: WALLET.BINANCE,
    image: BINANCE_IMAGE
  },
  {
    name: 'RAZOR',
    value: WALLET.RAZOR,
    image: RAZOR_IMAGE
  },
  {
    name: 'NIGHTLY',
    value: WALLET.NIGHTLY,
    image: NIGHTLY_IMAGE
  },
  {
    name: 'MARTIAN',
    value: WALLET.MARTIAN,
    image: MARTIAN_IMAGE
  }
]

export const WALLET_CONFIG_MAP = defineMap(WALLETS, 'value', ['name', 'value', 'image'])

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
  WALLET.BINANCE,
  WALLET.OKX,
  WALLET.BITGET,
  WALLET.TOKENPOCKET,
  WALLET.BYBIT,
  WALLET.ONEKEY,
  WALLET.WALLETCONNCET,
  WALLET.COIN98
]

export const FRACTAL_TESTNET_WALLET = [
  WALLET.UNISAT
]

export const FRACTAL_LIVENET_WALLET = [
  WALLET.UNISAT,
  WALLET.OKX
]

export const APTOS_WALLETS = [
  WALLET.MARTIAN,
  WALLET.NIGHTLY,
  WALLET.OKX
]

export const MOVMENT_APTOS_WALLETS = [
  WALLET.RAZOR,
  WALLET.NIGHTLY
]
