import { WALLET_TYPE, type onAccountChangedEvent, type TransactionParameter, type NETWORK, type FractalWalletImpl } from '../types'
import { Decimal } from 'decimal.js-light'
import { NoAlarmException } from 'oooo-components/lib/exception'

export class UnisatFractalWallet implements FractalWalletImpl {
  readonly type = WALLET_TYPE.FRACTAL

  provider: any
  accountsChangedEventName = 'accountsChanged'
  _onAccountsChanged?: any

  accountChangedEvents: onAccountChangedEvent[] = []

  async getProvider () {
    if (window.unisat == null) throw new NoAlarmException('Please install Unisat Wallet')
    return window.unisat
  }

  async setup () {
    /**
     * Just throw Error in raw BitcoinWallet, because every child class must implement getProvider function
     */
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    this.provider = await this.getProvider()

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      this.provider.on(this.accountsChangedEventName, this._onAccountsChanged)
    }
  }

  async getAccounts () {
    return this.provider.getAccounts() as string[]
  }

  async getNativeBalance () {
    const balance = await this.provider.getBalance()
    return (balance.confirmed * Math.pow(10, -8)).toString()
  }

  async connect () {
    const accounts = await this.provider.requestAccounts()
    const account = accounts[0]
    if (account == null) {
      throw new Error('Unable to access wallet account')
    }
    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      this.provider.on(this.accountsChangedEventName, this._onAccountsChanged)
    }

    return account as string
  }

  async disconnect () {
    try {
      if (this._onAccountsChanged != null) {
        void this.provider.removeListener(this.accountsChangedEventName, this._onAccountsChanged)
      }
      await this.provider.disconnect()
    } catch (e) {}
  }

  async sign (message: string) {
    const signature = await this.provider.signMessage(message)
    return signature
  }

  async getPublicKey () {
    return this.provider.getPublicKey()
  }

  async switchNetwork (network: NETWORK) {
    const currentNetwork = await this.provider.getNetwork()
    if (currentNetwork !== network) {
      await this.provider.switchNetwork(network)
    }
  }

  async transfer (parameter: TransactionParameter) {
    return this.provider.sendBitcoin(
      parameter.to,
      Number(new Decimal(parameter.value).mul(new Decimal(10).pow(8))),
      {
        feeRate: parameter.gas
      }
    )
  }

  async switchChain (chainName: string) {
    await this.provider.switchChain(chainName)
  }

  onAccountsChanged (accounts: string[]) {
    const account = accounts[0]

    this.accountChangedEvents.forEach(event => {
      event(account)
    })
  }

  addAccountChanged (event: onAccountChangedEvent) {
    this.accountChangedEvents.push(event)
  }
}
