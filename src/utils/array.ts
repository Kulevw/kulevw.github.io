import { getRandomInt, safeIndex } from './math'

export const safeGet = <T>(array: T[], index: number): T | null =>
  array[safeIndex(index, array.length)] ?? null

export const getRandomItem = <T>(array: readonly T[]): T | null =>
  array[getRandomInt(0, array.length - 1)] ?? null
