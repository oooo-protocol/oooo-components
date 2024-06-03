import { storage } from '@preflower/utils'

export default class Storage {
  readonly #key: string

  constructor (key: string) {
    this.#key = key
  }

  set (value: any) {
    storage.local.set(this.#key, value)
  }

  get<T = any> () {
    return storage.local.get<T>(this.#key)
  }

  remove () {
    storage.local.remove(this.#key)
  }
}
