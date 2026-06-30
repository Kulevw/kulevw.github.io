import type * as Utilites from './utilites'

declare global {
  export type Pair<T1, T2 = T1> = Utilites.Pair<T1, T2>
  export type PrimitiveKey = Utilites.PrimitiveKey
}

export {}
