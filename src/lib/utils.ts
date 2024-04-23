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
export function uuid() {
  var temp_url = URL.createObjectURL(new Blob());
  /**
   * Example
   * blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
   */
  var uuid = temp_url.toString();
  URL.revokeObjectURL(temp_url);
  return uuid.substring(uuid.lastIndexOf("/") + 1);
}
