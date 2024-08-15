import { type ChainConfig } from '../types'
import { EthereumWallet } from './ethereum'
import { EthereumProvider, type EthereumProviderOptions } from '@walletconnect/ethereum-provider'

const OPTIONS: EthereumProviderOptions = {
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  showQrModal: true,
  qrModalOptions: {
    themeMode: 'dark'
  },
  disableProviderPing: true,
  optionalChains: [1]
}

export class WalletConnectWallet extends EthereumWallet {
  async getProvider () {
    return await EthereumProvider.init(OPTIONS)
  }

  async assertChainSupport (chainId: string) {
    const { status } = await fetch(`https://rpc.walletconnect.com/v1/?chainId=eip155:${Number(chainId)}&projectId=62a7a8ff8a7d33fb300bbd3fa0e1c857`, {
      method: 'POST'
    })
    if (status === 400) {
      throw new Error('WalletConnect is not support current chain')
    }
  }

  async connect () {
    const accounts = await this.provider.enable()
    const account = accounts[0]
    if (account == null) {
      throw new Error('Unable to access wallet account')
    }
    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      this.provider.on(this.accountsChangedEventName, this._onAccountsChanged)
    }
    return account
  }

  async switchToChain (config: ChainConfig) {
    if (config == null) {
      throw new Error('The chain is not configured')
    }

    await this.assertChainSupport(config.chainId)

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: config.chainId
          }
        ]
      })
    } catch (e) {
      let err = e as any
      try {
        err = JSON.parse(err.message)
      } catch {}
      /**
       * fix metamask mobile not throw 4902 error when not selected chain.
       * reference: https://github.com/MetaMask/metamask-mobile/issues/2944#issuecomment-976988719
       */
      if (err.code === 4902 || err.code === -32603) {
        await this.addToChain(config)
        await this.switchToChain(config)
      } else {
        throw e
      }
    }
  }
}
