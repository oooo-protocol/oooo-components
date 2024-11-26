import { NoAlarmException } from 'oooo-components/lib/exception'
import { type AccountInfo, type NetworkInfo } from '@aptos-labs/wallet-standard'
import { type onAccountChangedEvent, type TransactionParameter, WALLET_TYPE } from 'oooo-components/oooo-wallet/types'
import { type AptosTokenConfig, type AptosTokenConfigWithRpc, type AptosWalletImpl } from '../types'
import { AccountAssetManager } from '@razorlabs/m1-wallet-sdk'
import { formatUnits, parseUnits } from 'ethers'

const CHAINID_NETWORK_MAP: Record<number, string> = {
  0x1: 'Mainnet',
  0x2: 'Testnet'
}

export class MartianWallet implements AptosWalletImpl {
  readonly type = WALLET_TYPE.APTOS

  provider: any
  _onAccountsChanged?: any
  accountChangedEvents: onAccountChangedEvent[] = []

  async getProvider () {
    if (!('martian' in window)) {
      throw new NoAlarmException('Please install Martian Wallet')
    }
    return window.martian as any
  }

  async setup () {
    /**
     * Just throw Error in standard Wallet, because every child class must implement getProvider function
     */
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    this.provider = await this.getProvider()

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      void this.provider.onAccountChange(this._onAccountsChanged)
    }
  }

  async getAccounts () {
    const account = await this.provider.account()
    if (account?.address != null) return [account.address]
    return []
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
    const { address } = await this.provider.connect()

    if (this._onAccountsChanged == null) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      void this.provider.onAccountChange(this._onAccountsChanged)
    }

    return address
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
    return res
  }

  async getPublicKey () {
    const { publicKey } = await this.provider.account()
    return publicKey
  }

  async transfer (parameter: TransactionParameter, config: AptosTokenConfig) {
    const res = await this.provider.generateSignAndSubmitTransaction(parameter.from, {
      function: config.function,
      arguments: [
        parameter.to,
        Number(parseUnits(parameter.value, config.decimals))
      ],
      type_arguments: config.coinType != null ? [config.coinType] : []
    }, {
      gas_unit_price: Number(parameter.gas)
    })
    return res
  }

  async switchToChain (networkInfo: NetworkInfo) {
    const network = await this.provider.network()

    if (network === CHAINID_NETWORK_MAP[networkInfo.chainId]) return
    console.log('switchToChain', networkInfo)
    try {
      await this.provider.changeNetwork(networkInfo.url)
    } catch (e) {
      console.log(e)
      if (e === 'Node url not registered') {
        await this.provider.addNetwork(networkInfo.url)

        await this.switchToChain(networkInfo)
      } else {
        throw new Error(e as string)
      }
    }
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
