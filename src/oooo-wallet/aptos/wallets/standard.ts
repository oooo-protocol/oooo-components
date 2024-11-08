import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter, type ChainConfig } from '../../types'
import { type AptosWalletImpl } from '../types'
import { AccountAssetManager, WalletAdapter } from '@razorlabs/m1-wallet-sdk'
import { type AccountInfo, type AptosWallet, type NetworkInfo, UserResponseStatus } from '@aptos-labs/wallet-standard'
import { UserRejectException } from 'oooo-components/lib/exception'
import { formatUnits, parseUnits } from 'ethers'

export class StandardWallet implements AptosWalletImpl {
  readonly type = WALLET_TYPE.APTOS

  provider!: WalletAdapter
  _standardAptosWallet!: AptosWallet
  _onAccountsChanged?: any
  accountChangedEvents: onAccountChangedEvent[] = []

  async getProvider (): Promise<AptosWallet> {
    throw new Error('Provider not config, please check it')
  }

  async setup () {
    /**
     * Just throw Error in standard Wallet, because every child class must implement getProvider function
     */
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    this._standardAptosWallet = await this.getProvider()
    this.provider = new WalletAdapter(this._standardAptosWallet)

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      void this.provider.onAccountChange(this._onAccountsChanged)
    }
  }

  async getAccounts () {
    return this.provider.accounts.map(account => account.address)
  }

  async getNativeBalance (address: string, config: ChainConfig) {
    const accountAssetManager = new AccountAssetManager(address, {
      chainRpcUrl: config.rpcUrls[0]
    })
    const balance = await accountAssetManager.getCoinBalance('0x1::aptos_coin::AptosCoin')
    const decimals = config.nativeCurrency.decimals
    return formatUnits(balance.toString(), decimals)
  }

  async connect () {
    const res = await this.provider.connect()
    if (res.status === UserResponseStatus.REJECTED) {
      throw new Error('Unable to access wallet account')
    }
    const { address } = res.args

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      void this.provider.onAccountChange(this._onAccountsChanged)
    }

    return address.toString()
  }

  async disconnect () {
    try {
      await this.provider.disconnect()
    } catch (e) {}
  }

  async sign (message: string) {
    const res = await this.provider.signMessage({
      message,
      address: true,
      /**
       * API 类型要求为 string, 但是实际调试的时候要求字段类型是 number...
       */
      nonce: 10000 as unknown as string
    })
    if (res.status === UserResponseStatus.REJECTED) {
      throw new UserRejectException()
    }
    return res.args
  }

  async getPublicKey () {
    const { publicKey } = await this.provider.account()
    return publicKey
  }

  async transfer (parameter: TransactionParameter, config: ChainConfig) {
    const res = await this.provider.signAndSubmitTransaction({
      gasUnitPrice: Number(parameter.gas),
      payload: {
        function: '0x1::aptos_account::transfer',
        functionArguments: [
          parameter.to,
          Number(parseUnits(parameter.value, config.nativeCurrency.decimals))
        ]
      }
    })
    console.log(res)
    if (res.status === UserResponseStatus.REJECTED) {
      throw new UserRejectException()
    }
    const { hash } = res.args
    return hash
  }

  async switchToChain (networkInfo: NetworkInfo) {
    console.log('switchToChain', networkInfo)
    const feature = this._standardAptosWallet.features['aptos:changeNetwork']
    if (!feature) {
      throw new Error('Wallet not implement error')
    }

    await feature.changeNetwork(networkInfo)
  }

  onAccountsChanged (account: AccountInfo) {
    const address = account.address.toString()

    this.accountChangedEvents.forEach(event => {
      event(address)
    })
  }

  addAccountChanged (event: onAccountChangedEvent) {
    this.accountChangedEvents.push(event)
  }
}
