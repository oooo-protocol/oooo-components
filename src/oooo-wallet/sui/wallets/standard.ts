import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter } from '../../types'
import { type AptosTokenConfigWithRpc, type AptosTokenConfig, type SuiWalletImpl } from '../types'
import { formatUnits, parseUnits, toUtf8Bytes } from 'ethers'
import { type Wallet } from '@mysten/wallet-standard'
import { AccountAssetManager, WalletAdapter } from '@suiet/wallet-sdk'
import { Transaction } from '@mysten/sui/transactions'

export class StandardWallet implements SuiWalletImpl {
  readonly type = WALLET_TYPE.SUI

  provider!: WalletAdapter
  _standardWallet!: Wallet
  _onAccountsChanged?: any
  accountChangedEvents: onAccountChangedEvent[] = []

  async getProvider (): Promise<Wallet> {
    throw new Error('Provider not config, please check it')
  }

  async setup () {
    /**
     * Just throw Error in standard Wallet, because every child class must implement getProvider function
     */
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    this._standardWallet = await this.getProvider()
    this.provider = new WalletAdapter(this._standardWallet)

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      this.provider.on('change', this._onAccountsChanged)
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
    const res = await this.provider.connect({})
    const account = res.accounts[0]
    const { address } = account

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      void this.provider.on('change', this._onAccountsChanged)
    }

    return address
  }

  async disconnect () {
    try {
      await this.provider.disconnect()
    } catch (e) {}
  }

  async sign (message: string) {
    const account = this.provider.accounts[0]
    const res = await this.provider.signPersonalMessage({
      message: toUtf8Bytes(message),
      account
    })
    return res.signature
  }

  async getPublicKey () {
    const account = this.provider.accounts[0]
    return account.publicKey
  }

  async transfer (parameter: TransactionParameter, config: AptosTokenConfig) {
    // 需要 decimals / chain 信息 / 代币地址
    const account = this.provider.accounts.find(item => item.address === parameter.from)

    if (!account) throw new Error('Current address is not connected to the wallet')

    const tx = new Transaction()
    const [coin] = tx.splitCoins('代币地址', [parseUnits(parameter.value, config.decimals)])
    tx.transferObjects([coin], parameter.to)
    const res = await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      account,
      chain: 'x:x'
    })
    console.log(res)
    return res.digest
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
