import { ACTIVE_COLOR, INACTIVE_COLOR } from './constants';

export function bgcolor(active: boolean) {
  return active ? ACTIVE_COLOR : INACTIVE_COLOR;
}
