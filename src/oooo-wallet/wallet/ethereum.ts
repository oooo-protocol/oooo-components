import { WALLET_TYPE, type TransactionParameter, type EthereumWalletImpl, type onAccountChangedEvent, type ChainConfig } from '../types'
import { ethers, formatEther, toBeHex, toUtf8Bytes, hexlify, formatUnits } from 'ethers'
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
        toBeHex(ethers.parseUnits(parameter.value, decimals))
      ]
      const gasLimit = await contract.transfer.estimateGas(...transferParam)
      const { hash } = await contract.transfer(
        ...transferParam,
        {
          gasPrice: parameter.gas,
          gasLimit: toBeHex(gasLimit)
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
