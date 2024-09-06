import { WALLET_TYPE, type TransactionParameter, type EthereumWalletImpl, type onAccountChangedEvent, type ChainConfig } from '../types'
import { ethers, formatEther, toUtf8Bytes, hexlify, formatUnits, type TransactionRequest } from 'ethers'
import { NoAlarmException } from 'oooo-components/lib/exception'
import { EVM_ADDRESS_REGEXP } from 'oooo-components/lib/utils'

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  }, {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  }, {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
]

export class EthereumWallet implements EthereumWalletImpl {
  readonly type = WALLET_TYPE.ETHEREUM

  provider: any
  accountsChangedEventName = 'accountsChanged'
  _onAccountsChanged?: (accounts: string[]) => void
  accountChangedEvents: onAccountChangedEvent[] = []

  async getProvider (): Promise<any> {
    if (window.ethereum == null) throw new NoAlarmException('Please install Wallet plugin')
    return window.ethereum
  }

  async setup () {
    /**
     * Just throw Error in raw BitcoinWallet, because every child class must implement getProvider function
     */
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    this.provider = await this.getProvider()

    if (!this._onAccountsChanged) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      this.provider.on(this.accountsChangedEventName, this._onAccountsChanged)
    }
  }

  async getAccounts () {
    return await this.provider.request({ method: 'eth_accounts' }) as string[]
  }

  async connect () {
    const accounts = await this.provider.request({ method: 'eth_requestAccounts' })
    const account = accounts[0]
    if (account == null) {
      throw new Error('Unable to access wallet account')
    }
    if (!this._onAccountsChanged) {
      this._onAccountsChanged = this.onAccountsChanged.bind(this)
      this.provider.on(this.accountsChangedEventName, this._onAccountsChanged)
    }
    return account as string
  }

  async disconnect () {
    try {
      if (this._onAccountsChanged) {
        void this.provider.removeListener(this.accountsChangedEventName, this._onAccountsChanged)
      }
      await this.provider.disconnect?.()
    } catch (e) {}
  }

  async switchToChain (config: ChainConfig) {
    if (config == null) {
      throw new Error('The chain is not configured')
    }

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
      const err = e as any
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

  async addToChain (config: ChainConfig) {
    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [config]
    })
  }

  async getNativeBalance (address: string, rpc: string) {
    const provider = new ethers.JsonRpcProvider(rpc)
    try {
      const balance = await provider.getBalance(address)
      return formatEther(balance)
    } finally {
      provider.destroy()
    }
  }

  async getTokenBalance (address: string, rpc: string, contractAddress: string) {
    const provider = new ethers.JsonRpcProvider(rpc)
    try {
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider)
      const balance = await contract.balanceOf(address)
      const decimals = await contract.decimals()
      return formatUnits(balance, decimals)
    } finally {
      provider.destroy()
    }
  }

  async tokenTransfer (parameter: TransactionParameter, contractAddress: string) {
    const provider = new ethers.BrowserProvider(this.provider)
    try {
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
      const decimals = await contract.decimals()
      const transferParam = [
        parameter.to,
        ethers.parseUnits(parameter.value, decimals)
      ]
      const gasLimit = await contract.transfer.estimateGas(...transferParam)
      const { hash } = await contract.transfer(
        ...transferParam,
        {
          gasPrice: parameter.gas,
          gasLimit
        }
      )
      return hash
    } finally {
      provider.destroy()
    }
  }

  async sign (message: string, from: string) {
    const parameter = {
      method: 'personal_sign',
      params: [
        hexlify(toUtf8Bytes(message)),
        from
      ]
    }
    console.log('personal_sign', parameter)
    const signature = await this.provider.request(parameter)
    return signature
  }

  async transfer (parameter: TransactionParameter, config: ChainConfig) {
    const provider = new ethers.BrowserProvider(this.provider)
    try {
      const signer = await provider.getSigner()
      const params: TransactionRequest = {
        gasPrice: parameter.gas,
        to: parameter.to,
        from: parameter.from,
        value: ethers.parseUnits(parameter.value, config.nativeCurrency.decimals)
      }
      const gasLimit = await provider.estimateGas(params)
      params.gasLimit = gasLimit
      // EIP-155 define, to prevent "replay attacks"
      params.chainId = config.chainId
      console.log('eth_sendTransaction', params)
      const { hash } = await signer.sendTransaction(params)
      return hash
    } finally {
      provider.destroy()
    }
  }

  onAccountsChanged (accounts: string[]) {
    const account = accounts[0]

    this.accountChangedEvents.forEach(event => {
      if (EVM_ADDRESS_REGEXP.test(account)) {
        event(account)
      } else {
        event(undefined)
      }
    })
  }

  addAccountChanged (event: onAccountChangedEvent) {
    this.accountChangedEvents.push(event)
  }
}
