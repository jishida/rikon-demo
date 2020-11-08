import React, { useCallback } from 'react';
import Switch, {
  SwitchProps as MuiSwitchProps,
} from '@material-ui/core/Switch';

import { CheckedStateProps, State } from '../../utils/hooks';

export type SwitchProps<S extends State<boolean>> = CheckedStateProps<
  MuiSwitchProps,
  S
>;

export default React.forwardRef<HTMLButtonElement, SwitchProps<State<boolean>>>(
  (props, ref) => {
    const { control, ...obj } = props;
    control.use();
    const p = obj as MuiSwitchProps;
    p.disabled = !control.actualEnabled;
    p.checked = control.value;
    p.onChange = useCallback(
      (e, checked) => {
        control.value = checked;
        if (props.onChange) {
          props.onChange(e, checked);
        }
      },
      [props.onChange]
    );
    return <Switch {...p} ref={ref} />;
  }
);
