import { WALLET_TYPE, type TransactionParameter, type EthereumWalletImpl, type onAccountChangedEvent, type ChainConfig } from '../types'
import { ethers, formatEther, toBeHex, toUtf8Bytes, hexlify } from 'ethers'
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
  }
]

export class EthereumWallet implements EthereumWalletImpl {
  readonly type = WALLET_TYPE.ETHEREUM

  get provider () {
    if (window.ethereum == null) throw new NoAlarmException('Please install Wallet plugin')
    return window.ethereum
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
    return account as string
  }

  async disconnect () {
    void this.provider.removeAllListeners()
    try {
      // @ts-expect-error some wallet can use `disconnect` to direct logout, such as OKX
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
      if ((e as any).code === 4902) {
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
      return formatEther(balance)
    } finally {
      provider.destroy()
    }
  }

  async tokenTransfer (parameter: TransactionParameter, config: ChainConfig, contractAddress: string) {
    const provider = new ethers.BrowserProvider(this.provider)
    try {
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
      const { hash } = await contract.transfer(
        parameter.to,
        toBeHex(ethers.parseUnits(parameter.value, config.nativeCurrency.decimals))
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
    const param = {
      method: 'eth_sendTransaction',
      params: [{
        gasPrice: toBeHex(Number(parameter.gas)),
        gas: '0x5208',
        to: parameter.to,
        from: parameter.from,
        value: toBeHex(ethers.parseUnits(parameter.value, config.nativeCurrency.decimals)),
        data: '0x',
        chainId: config.chainId
      }]
    }
    console.log('eth_sendTransaction', param)
    return await this.provider.request(param)
  }

  async onAccountChanged (event: onAccountChangedEvent) {
    await this.provider.on('accountsChanged', (accounts: string[]) => {
      const account = accounts[0]
      if (EVM_ADDRESS_REGEXP.test(account)) {
        event(account)
      } else {
        event(undefined)
      }
    })
  }
}