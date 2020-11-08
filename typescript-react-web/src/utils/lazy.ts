class Lazy<T> {
  private _loaded = false;
  private _value?: T;
  readonly _lazy_getter: () => T;

  constructor(getter: () => T) {
    this._lazy_getter = () => {
      if (!this._loaded) {
        this._value = getter();
        this._loaded = true;
      }
      return this._value as T;
    };
  }
}

export function lazy<T>(getter: () => T): T {
  return (new Lazy(getter) as any) as T;
}

export function finalizeLazy(obj: { [s: string]: any }, depth: number = 1) {
  if (Array.isArray(obj)) {
    obj.forEach((v) => {
      finalizeLazy(v, depth);
    });
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      if (value != null && typeof value === 'object') {
        if (typeof value._lazy_getter === 'function') {
          Object.defineProperty(obj, key, {
            get: value._lazy_getter,
            enumerable: true,
          });
        } else {
          if (depth > 1) {
            finalizeLazy(value, --depth);
          } else if (depth < 1) {
            finalizeLazy(value, depth);
          }
        }
      }
    });
  }
}

export function createLazyObject<A extends any[]>(
  lazyObjectClass: { new (...args: A) },
  ...args: A
) {
  const obj = new lazyObjectClass(...args);
  finalizeLazy(obj);
  return obj;
}
