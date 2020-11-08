import { useEffect, useState } from 'react';

import {
  Container,
  ContainerOptions,
  Control,
  State,
  Validatable,
  ValidatableState,
  ParsableState,
  Disposable,
} from './types';

function isInheritEnabled(opts?: ContainerOptions) {
  return opts && (opts.inheritsEnabled == null || opts.inheritsEnabled);
}

function isInheritValidate(opts?: ContainerOptions) {
  return opts && (opts.inheritsValidation == null || opts.inheritsValidation);
}

export class ControlContainer implements Container {
  private _opts?: ContainerOptions;
  private _listeners = new Set<(b: boolean) => void>();
  private _validatables = new Set<Validatable>();
  private _disposables = new Set<Disposable>();
  private _enabled: boolean = true;

  private _validateEnabled: boolean = true;

  private _listener?: (b: boolean) => void;

  constructor(opts?: ContainerOptions) {
    if (opts) {
      this._opts = Object.assign({}, opts);
      if (isInheritEnabled(this._opts)) {
        this._listener = (b: boolean) => {
          this.onParentEnabledChange(b);
        };
        this._opts.container.addEnabledChangeListener(this._listener);
      }
      if (isInheritValidate(this._opts)) {
        this._opts.container.regesterValidatable(this);
      }
      this._opts.container.regesterDisposable(this);
    }
  }

  protected onParentEnabledChange(b: boolean) {
    this.handleEnabledChangeListeners(b);
  }

  get enabled() {
    return this._enabled;
  }

  get actualEnabled() {
    if (isInheritEnabled(this._opts)) {
      return this._opts.container.enabled && this._enabled;
    } else {
      return this._enabled;
    }
  }

  protected handleEnabledChangeListeners(b: boolean) {
    this._listeners.forEach((listener) => {
      listener(b);
    });
  }

  set enabled(b: boolean) {
    this._enabled = b;
    this.handleEnabledChangeListeners(this.enabled);
  }

  get validateEnabled() {
    if (isInheritValidate(this._opts)) {
      return this._opts.container.validateEnabled && this._validateEnabled;
    } else {
      return this._validateEnabled;
    }
  }

  set validateEnabled(b: boolean) {
    this._validateEnabled = b;
  }

  addEnabledChangeListener(listener: (b: boolean) => void) {
    this._listeners.add(listener);
  }

  removeEnabledChangeListener(listener: (b: boolean) => void) {
    this._listeners.delete(listener);
  }

  regesterDisposable(item: Disposable) {
    this._disposables.add(item);
  }

  regesterValidatable(item: Validatable) {
    this._validatables.add(item);
  }

  unregesterDisposable(item: Disposable) {
    this._disposables.delete(item);
  }

  unregesterValidatable(item: Validatable) {
    this._validatables.delete(item);
  }

  control(inheritEnabled?: boolean) {
    return new ControlImpl({
      container: this,
      inheritsEnabled: inheritEnabled,
    });
  }

  state<V>(initialValue: V, inheritEnabled?: boolean) {
    return new StateImpl(initialValue, {
      container: this,
      inheritsEnabled: inheritEnabled,
    });
  }

  validatable<V>(
    initialValue: V,
    validator: (v: V) => boolean,
    inheritEnabled?: boolean,
    inheritValidate?: boolean
  ) {
    return new ValidatableStateImpl(initialValue, validator, {
      container: this,
      inheritsEnabled: inheritEnabled,
      inheritsValidation: inheritValidate,
    });
  }

  parsable<V, R>(
    initialValue: V,
    parser: (v: V) => R,
    inheritEnabled?: boolean,
    inheritValidate?: boolean
  ) {
    return new ParsableStateImpl(initialValue, parser, {
      container: this,
      inheritsEnabled: inheritEnabled,
      inheritsValidation: inheritValidate,
    });
  }

  array<V>(initialValue: V[], inheritEnabled?: boolean) {
    return new ArrayState(initialValue, {
      container: this,
      inheritsEnabled: inheritEnabled,
    });
  }

  protected validateImpl() {
    if (!this.validateEnabled) {
      return true;
    }
    let ok = true;
    this._validatables.forEach((v) => {
      if (!v.validate()) {
        ok = false;
      }
    });
    return ok;
  }

  readonly validate = () => {
    return this.validateImpl();
  };

  protected disposeImpl() {
    if (this._opts) {
      if (this._listener) {
        this._opts.container.removeEnabledChangeListener(this._listener);
      }
      this._opts.container.unregesterValidatable(this);
      this._opts.container.unregesterDisposable(this);
      this._opts = null;
    }
    this._disposables.forEach((d) => {
      d.dispose();
    });
    this._listeners.clear();
    this._validatables.clear();
    this._disposables.clear();
  }

  readonly dispose = () => {
    this.disposeImpl();
  };
}

export class ControlImpl implements Control {
  // 0x01: Control Enabled
  // 0x02: Container Enabled
  // 0x04: Has Error
  private _flag: number = 0x01;
  private _flagSetter?: (f: number) => void;
  private _mounted: boolean = false;
  private _listener?: (b: boolean) => void;

  protected readonly opts?: ContainerOptions;

  constructor(opts: ContainerOptions) {
    if (opts) {
      this.opts = opts;
      opts.container.regesterDisposable(this);
      if (isInheritEnabled(this.opts)) {
        this._listener = (b: boolean) => {
          if (b) {
            this.flag = this.flag | 0x02;
          } else {
            this.flag = this.flag & 0xfffffffd;
          }
        };
        opts.container.addEnabledChangeListener(this._listener);
        if (opts.container.enabled) {
          this._flag = this._flag | 0x02;
        }
      }
    }
  }

  get mounted() {
    return this._mounted;
  }

  get actualEnabled() {
    return (this._flag & 0x03) === 0x03;
  }

  get enabled() {
    return (this._flag & 0x01) === 0x01;
  }

  set enabled(b: boolean) {
    if (b) {
      this.flag |= 0x01;
    } else {
      this.flag &= 0xfffffffe;
    }
  }

  protected get flag() {
    return this._flag;
  }

  protected set flag(f: number) {
    this._flag = f;
    if (this._mounted && this._flagSetter) {
      this._flagSetter(f);
    }
  }

  protected useImpl() {}

  readonly use = () => {
    useEffect(() => {
      this._mounted = true;
      return () => {
        this._mounted = false;
      };
    }, []);
    this._flagSetter = useState(this._flag)[1];
    this.useImpl();
  };

  protected disposeImpl() {
    if (this.opts) {
      this.opts.container.unregesterDisposable(this);
    }
  }

  dispose() {
    this.disposeImpl();
  }
}

export class StateImpl<V> extends ControlImpl implements State<V> {
  private _value: V;
  private _valueSetter?: (v: V) => void;

  constructor(initialValue: V, opts?: ContainerOptions) {
    super(opts);
    this._value = initialValue;
  }

  get value() {
    return this._value;
  }

  protected setValueImpl(v: V) {
    this._value = v;
    if (this.mounted && this._valueSetter) {
      this._valueSetter(v);
    }
  }

  set value(v: V) {
    this.setValueImpl(v);
  }

  protected useImpl() {
    this._valueSetter = useState(this._value)[1];
  }
}

export abstract class ValidatableStateBase<V>
  extends StateImpl<V>
  implements ValidatableState<V> {
  private _validateEnabled: boolean = true;
  private _errorMessage: string = '';
  private _errorMessageSetter?: (m: string) => void;

  constructor(initialValue: V, opts?: ContainerOptions) {
    super(initialValue, opts);
    if (isInheritValidate(this.opts)) {
      this.opts.container.regesterValidatable(this);
    }
  }

  protected useImpl() {
    super.useImpl();
    this._errorMessageSetter = useState(this._errorMessage)[1];
  }

  get hasError() {
    return (this.flag & 0x04) === 0x04;
  }

  set hasError(b: boolean) {
    if (b) {
      this.flag |= 0x4;
    } else {
      this.flag &= 0xfffffffb;
    }
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(m: string) {
    this._errorMessage = m;
    if (this.mounted && this._errorMessageSetter) {
      this._errorMessageSetter(m);
    }
  }

  get validateEnabled() {
    if (isInheritValidate(this.opts)) {
      return this.opts.container.validateEnabled && this._validateEnabled;
    } else {
      return this._validateEnabled;
    }
  }

  protected abstract validateImpl(): boolean;

  readonly validate = () => {
    try {
      this.hasError = this.validateEnabled ? !this.validateImpl() : false;
      this.errorMessage = '';
    } catch (e) {
      this.hasError = true;
      if (e instanceof Error) {
        this.errorMessage = e.message;
      } else if (typeof e === 'string') {
        this.errorMessage = e;
      } else {
        this.errorMessage = '';
      }
    }
    return !this.hasError;
  };
}

export class ValidatableStateImpl<V> extends ValidatableStateBase<V> {
  private _validator: (v: V) => boolean;
  constructor(
    initialValue: V,
    validator: (v: V) => boolean,
    opts?: ContainerOptions
  ) {
    super(initialValue, opts);
    this._validator = validator;
  }

  protected validateImpl() {
    return this._validator(this.value);
  }
}

export class ParsableStateImpl<V, R>
  extends ValidatableStateBase<V>
  implements ParsableState<V, R> {
  private _parser: (v: V) => R;
  private _result?: R;
  private _resultInitialized: boolean = false;

  constructor(initialValue: V, parser: (v: V) => R, opts?: ContainerOptions) {
    super(initialValue, opts);
    this._parser = parser;
  }

  get result(): R {
    if (!this._resultInitialized || this.hasError) {
      if (!this.validate()) {
        throw new ReferenceError('Invalid result value');
      }
    }
    return this._result!!;
  }

  protected validateImpl() {
    this._result = this._parser(this.value);
    this._resultInitialized = true;
    return true;
  }
}

export class ArrayState<V> extends ControlImpl {
  private _value: V[];
  private _valueSetter?: (v: { arr: V[] }) => void;

  constructor(initialValue: V[] = [], opts?: ContainerOptions) {
    super(opts);
    this._value = initialValue;
  }

  get value() {
    return this._value;
  }

  set value(v: V[]) {
    this.setValueImpl(v);
  }

  protected setValueImpl(v: V[]) {
    this._value = v;
    if (this.mounted && this._valueSetter) {
      this._valueSetter({ arr: v });
    }
  }

  get length() {
    return this.value.length;
  }

  protected updateImpl() {
    this.setValueImpl(this.value);
  }

  readonly update = () => {
    this.updateImpl();
  };

  protected useImpl() {
    super.useImpl();
    this._valueSetter = useState({ arr: this._value })[1];
  }

  protected pushImpl(...items: V[]) {
    const result = this._value.push(...items);
    this.update();
    return result;
  }

  readonly push = (...items: V[]) => {
    return this.pushImpl(...items);
  };

  protected popImpl() {
    const result = this._value.pop();
    this.update();
    return result;
  }

  readonly pop = () => {
    return this.popImpl();
  };

  protected unshiftImpl(...items: V[]) {
    const result = this._value.unshift(...items);
    this.update();
    return result;
  }

  readonly unshift = (...items: V[]) => {
    return this.unshiftImpl(...items);
  };

  protected shiftImpl() {
    const result = this._value.shift();
    this.update();
    return result;
  }

  readonly shift = () => {
    return this.shiftImpl();
  };

  protected spliceImpl(start: number, deleteCount?: number) {
    const result =
      deleteCount == null
        ? this._value.splice(start)
        : this._value.splice(start, deleteCount);
    this.update();
    return result;
  }

  readonly splice = (start: number, deleteCount?: number) => {
    return this.spliceImpl(start, deleteCount);
  };
}
