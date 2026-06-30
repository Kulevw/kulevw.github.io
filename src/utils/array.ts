import { getRandomInt, safeIndex } from './math'

export const safeGet = <T>(array: T[], index: number): T | null =>
  array[safeIndex(index, array.length)] ?? null

export const getRandomItem = <T>(array: readonly T[]): T | null =>
  array[getRandomInt(0, array.length - 1)] ?? null

export const groupBy = <T = unknown, K extends PrimitiveKey = string>(
  items: T[],
  keyOf: (it: T) => K,
): Record<K, T[]> =>
  items.reduce(
    (map, it) => {
      const key = keyOf(it)

      map[key] = (map[key] ?? []).concat([it])

      return map
    },
    {} as Record<PrimitiveKey, T[]>,
  )
