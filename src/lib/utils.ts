import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Updater } from '@tanstack/vue-table'
import { type Ref } from 'vue'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>> (updaterOrValue: T, ref: Ref) {
  ref.value =
    typeof updaterOrValue === 'function'
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

/**
 * use `URL.createObjectURL` to generate uuid, `URL.createObjectURL` will return a uuid string in url's end
 * @returns
 */
export function uuid () {
  const tempUrl = URL.createObjectURL(new Blob())
  /**
   * Example
   * blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
   */
  const uuid = tempUrl.toString()
  URL.revokeObjectURL(tempUrl)
  return uuid.substring(uuid.lastIndexOf('/') + 1)
}

export function formatHashWithEllipsis (hash: string, front = 6, tail = 4) {
  return `${hash.substring(0, front)}...${hash.substring(hash.length - tail)}`
}

export const EVM_ADDRESS_REGEXP = /^(0x)[0-9A-Fa-f]{40}$/
