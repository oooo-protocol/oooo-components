import Cookies from 'js-cookie'

/**
 * Get current second level domain, not include port
 */
function getDomain (): string {
  const host = window.location.hostname
  const segments = host.split('.')
  return segments.slice(-2).join('.')
}

export default class Storage {
  readonly #key: string

  constructor (key: string) {
    this.#key = key
  }

  set (value: any) {
    Cookies.set(this.#key, JSON.stringify(value), { domain: getDomain() })
  }

  get<T = any> (): T | undefined {
    const result = Cookies.get(this.#key)
    try {
      return result != null ? JSON.parse(result) : undefined
    } catch {
      return result as T
    }
  }

  remove () {
    Cookies.remove(this.#key)
  }
}
