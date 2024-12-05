import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter } from '../../types'
import { type SuiTokenConfigWithRpc, type SuiWalletImpl } from '../types'
import { formatUnits, parseUnits, toUtf8Bytes } from 'ethers'
import { type Wallet, type StandardEventsChangeProperties } from '@mysten/wallet-standard'
import { AccountAssetManager, WalletAdapter } from '@suiet/wallet-sdk'
import { Transaction } from '@mysten/sui/transactions'
import { SuiClient } from '@mysten/sui/client'

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

  async getBalance (address: string, config: SuiTokenConfigWithRpc) {
    const accountAssetManager = new AccountAssetManager(address, {
      chainRpcUrl: config.chainRpcUrl
    })
    const balance = await accountAssetManager.getCoinBalance(config.coinType ?? '0x2::sui::SUI')
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
    return account.address
  }

  async transfer (parameter: TransactionParameter, config: SuiTokenConfigWithRpc) {
    const account = this.provider.accounts.find(item => item.address === parameter.from)
    if (account == null) throw new Error('Current address is not connected to the wallet')

    const tx = new Transaction()
    let coinObjectId
    if (config.coinType === '0x2::sui::SUI') {
      coinObjectId = tx.gas
    } else {
      const client = new SuiClient({ url: config.chainRpcUrl })
      const { data: coins } = await client.getCoins({
        owner: parameter.from,
        coinType: config.coinType
      })
      coinObjectId = coins[0].coinObjectId
    }
    const [coin] = tx.splitCoins(coinObjectId, [parseUnits(parameter.value, config.decimals)])
    tx.transferObjects([coin], parameter.to)
    const res = await this.provider.signAndExecuteTransactionBlock({
      transactionBlock: tx,
      account,
      chain: config.chain
    })
    console.log(res)
    return res.digest
  }

  async estimateGas (parameter: TransactionParameter, config: SuiTokenConfigWithRpc) {
    const client = new SuiClient({ url: config.chainRpcUrl })
    const tx = new Transaction()
    let coinObjectId
    if (config.coinType === '0x2::sui::SUI') {
      coinObjectId = tx.gas
    } else {
      const client = new SuiClient({ url: config.chainRpcUrl })
      const { data: coins } = await client.getCoins({
        owner: parameter.from,
        coinType: config.coinType
      })
      coinObjectId = coins[0].coinObjectId
    }
    const [coin] = tx.splitCoins(coinObjectId, [parseUnits(parameter.value, config.decimals)])
    tx.transferObjects([coin], parameter.to)
    const result = await client.devInspectTransactionBlock({
      sender: parameter.from,
      transactionBlock: tx
    })
    const { computationCost, storageCost, storageRebate } = result.effects.gasUsed
    return Number(computationCost + storageCost) - Number(storageRebate) + ''
  }

  onAccountsChanged (properties: StandardEventsChangeProperties) {
    if (properties.accounts == null) return
    const account = properties.accounts[0]
    const address = account.address

    this.accountChangedEvents.forEach(event => {
      event(address)
    })
  }

  addAccountChanged (event: onAccountChangedEvent) {
    this.accountChangedEvents.push(event)
  }
}
