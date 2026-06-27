type EventDeclare = {
  [key in string]: (...args: never[]) => unknown
}

type EventMap<D extends EventDeclare> = {
  [K in keyof D]?: D[K][]
}

export interface EventEmitter<D extends EventDeclare> {
  on<E extends keyof D>(e: E, handler: D[E]): void
  off<E extends keyof D>(e: E, handler: D[E]): void
  emit<E extends keyof D>(e: E, ...args: Parameters<D[E]>): void
  once<E extends keyof D>(e: E, handler: D[E]): void
}

export const makeEventEmitter = <D extends EventDeclare>(): EventEmitter<D> => {
  const map: EventMap<D> = {}

  const on = <E extends keyof D>(e: E, handler: D[E]) => {
    map[e] = (map[e] ?? []).concat(handler)
  }

  const off = <E extends keyof D>(e: E, handler: D[E]) => {
    map[e] = map[e]?.filter((value) => value !== handler)
  }

  const emit = <E extends keyof D>(e: E, ...args: Parameters<D[E]>) => {
    map[e]?.forEach((handler) => handler(...args))
  }

  const once = <E extends keyof D>(e: E, handler: D[E]) => {
    const wrapper = (...args: Parameters<D[E]>) => {
      handler(...args)
      off(e, wrapper as D[E])
    }

    on(e, wrapper as D[E])
  }

  return {
    on,
    off,
    emit,
    once,
  }
}
