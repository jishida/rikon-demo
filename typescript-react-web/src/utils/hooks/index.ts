import {
  ControlImpl,
  StateImpl,
  ValidatableStateImpl,
  ParsableStateImpl,
  ArrayState,
} from './impl';
import { Container, Control, State } from './types';

export * from './types';
export { ControlContainer, ArrayState } from './impl';

export function createControl(
  container?: Container,
  inheritsEnabled?: boolean
): Control {
  const opts = container ? { container, inheritsEnabled } : void 0;
  return new ControlImpl(opts);
}

export function createState<V>(
  initialValue: V,
  container?: Container,
  inheritsEnabled?: boolean
): State<V> {
  const opts = container ? { container, inheritsEnabled } : void 0;
  return new StateImpl(initialValue, opts);
}

export function createValidatable<V>(
  initialValue: V,
  validator: (v: V) => boolean,
  container?: Container,
  inheritsEnabled?: boolean,
  inheritsValidation?: boolean
) {
  const opts = container
    ? { container, inheritsEnabled, inheritsValidation }
    : void 0;
  return new ValidatableStateImpl(initialValue, validator, opts);
}

export function createParsable<V, R>(
  initialValue: V,
  validator: (v: V) => R,
  container?: Container,
  inheritsEnabled?: boolean,
  inheritsValidation?: boolean
) {
  const opts = container
    ? { container, inheritsEnabled, inheritsValidation }
    : void 0;
  return new ParsableStateImpl(initialValue, validator, opts);
}

export function createArrayState<V>(
  initialValue: V[],
  container?: Container,
  inheritsEnabled?: boolean
) {
  const opts = container ? { container, inheritsEnabled } : void 0;
  return new ArrayState(initialValue, opts);
}
