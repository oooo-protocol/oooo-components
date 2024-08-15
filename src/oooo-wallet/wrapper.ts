import { ref, watch } from 'vue'
import Storage from './storage'
import { type WALLET, type WalletImpl, type WalletConstructor } from './types'

interface WalletStorage {
  address: string
  name: WALLET
}

export default class OoooWalletWrapper<T extends WalletImpl> {
  name = ref<WALLET>()
  address = ref<string>()

  readonly #wallets: Record<string, WalletConstructor> = {}

  #instance: T | undefined

  readonly #storage

  get instance () {
    if (this.#instance == null) {
      throw new Error('Not init wallet before calling')
    }
    return this.#instance
  }

  constructor (key: string, wallets: Record<string, WalletConstructor>) {
    Object.entries(wallets).forEach(([key, value]) => {
      this.#wallets[key] = value
    })

    this.#storage = new Storage(key)

    const result = this.#storage.get<WalletStorage>()
    if (result != null) {
      const { name, address } = result
      void this.initWallet(name, address)
    }

    watch([this.name, this.address], ([name, address]) => {
      if (name == null || address == null) {
        this.#storage.remove()
      } else {
        this.#storage.set({ name, address })
      }
    })
  }

  async initInstance (name: WALLET) {
    const Wallet = this.#wallets[name]
    if (Wallet == null) throw new Error(`Wallet ${name} is not supported.`)
    this.#instance = new Wallet() as T
    await this.instance.setup()
    return this.#instance
  }

  async initWallet (name: WALLET, address: string) {
    try {
      await this.initInstance(name)
      this.name.value = name
      this.address.value = address
      const accounts = await this.instance.getAccounts()
      /**
       * fix bybit wallet getAccounts return all lowcase address list
       */
      if (accounts.some(account => account.toLocaleLowerCase() === address.toLocaleLowerCase())) {
        this.instance.addAccountChanged(this.handleAddressChanged.bind(this))
      } else {
        throw new Error('[oooo-wallet]: The authorized account does not match the current account')
      }
    } catch (e) {
      void this.onLogout()
      throw e
    }
  }

  async onConnect (name: WALLET) {
    // Prevent some events not be unmount error
    await this.onLogout()

    await this.initInstance(name)
    const address = await this.instance.connect()
    await this.initWallet(name, address)
  }

  async onLogout () {
    this.name.value = undefined
    this.address.value = undefined

    if (this.#instance) {
      void this.#instance.disconnect()
      this.#instance = undefined
    }
  }

  handleAddressChanged (account?: string) {
    if (account != null && this.name.value != null) {
      this.address.value = account
    } else {
      void this.onLogout()
    }
  }
}
