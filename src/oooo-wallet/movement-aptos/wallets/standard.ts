import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter } from '../../types'
import { type MovementAptosWalletImpl } from '../types'
import { AccountAssetManager, WalletAdapter } from '@razorlabs/m1-wallet-sdk'
import { type AccountInfo, type AptosWallet, type NetworkInfo, UserResponseStatus } from '@aptos-labs/wallet-standard'
import { UserRejectException } from 'oooo-components/lib/exception'
import { formatUnits, parseUnits } from 'ethers'
import { type MoveFunctionId } from '@aptos-labs/ts-sdk'
import { type AptosTokenConfig, type AptosTokenConfigWithRpc } from 'oooo-components/oooo-wallet/aptos/types'

export class StandardWallet implements MovementAptosWalletImpl {
  readonly type = WALLET_TYPE.MOVEMENT_APTOS

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

  async getBalance (address: string, config: AptosTokenConfigWithRpc) {
    const accountAssetManager = new AccountAssetManager(address, {
      chainRpcUrl: config.chainRpcUrl
    })
    const balance = await accountAssetManager.getCoinBalance(config.coinType ?? '0x1::aptos_coin::AptosCoin')
    const decimals = config.decimals
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

  async transfer (parameter: TransactionParameter, config: AptosTokenConfig) {
    const res = await this.provider.signAndSubmitTransaction({
      gasUnitPrice: Number(parameter.gas),
      payload: {
        function: config.function as MoveFunctionId,
        functionArguments: [
          parameter.to,
          Number(parseUnits(parameter.value, config.decimals))
        ],
        typeArguments: config.coinType != null ? [config.coinType] : undefined
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
    const currentNetwork = await this._standardAptosWallet.features['aptos:network'].network()
    if (currentNetwork.chainId === networkInfo.chainId) return
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
