export interface Hook {
  use(): void;
}

export interface Disposable {
  dispose(): void;
}

export interface Validatable {
  validate(): boolean;
}

export interface Control extends Disposable, Hook {
  readonly actualEnabled: boolean;
  enabled: boolean;
  readonly mounted: boolean;
}

export interface State<V> extends Control {
  value: V;
}

export interface ValidatableState<V> extends State<V>, Validatable {
  validateEnabled: boolean;
  hasError: boolean;
  errorMessage: string;
}

export interface ParsableState<V, R> extends ValidatableState<V> {
  readonly result: R;
}

export interface Container extends Validatable {
  addEnabledChangeListener(listener: (b: boolean) => void): void;
  removeEnabledChangeListener(listener: (b: boolean) => void): void;
  regesterDisposable(item: Disposable): void;
  unregesterDisposable(item: Disposable): void;
  regesterValidatable(item: Validatable): void;
  unregesterValidatable(item: Validatable): void;
  readonly actualEnabled: boolean;
  readonly enabled: boolean;
  readonly validateEnabled: boolean;
}

export interface ContainerOptions {
  container: Container;
  inheritsEnabled?: boolean;
  inheritsValidation?: boolean;
}

export interface ControlPropsBase {
  disabled?: boolean;
}

export interface CheckedPropsBase extends ControlPropsBase {
  checked?: boolean;
}

export interface ValuePropsBase<V> extends ControlPropsBase {
  value?: V;
}

export type ControlProps<P extends ControlPropsBase, C extends Control> = Omit<
  P,
  'disabled'
> & { control: C };

export type CheckedStateProps<
  P extends CheckedPropsBase,
  S extends State<boolean>
> = Omit<ControlProps<P, S>, 'checked'>;

export type ValueStateProps<
  V,
  P extends ValuePropsBase<unknown>,
  S extends State<V>
> = Omit<ControlProps<P, S>, 'value'>;
