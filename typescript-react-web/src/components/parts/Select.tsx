import React from 'react';
import { Select, SelectProps as MuiSelectProps } from '@material-ui/core';

import { State, ValueStateProps } from '../../utils/hooks';

export type SelectProps<V, S extends State<any>> = ValueStateProps<
  V,
  MuiSelectProps,
  S
>;

export default React.forwardRef<unknown, SelectProps<unknown, State<unknown>>>(
  (props, ref) => {
    const { control, ...obj } = props;
    control.use();
    const p = obj as MuiSelectProps;
    p.disabled = !control.actualEnabled;
    p.value = control.value;
    p.onChange = React.useCallback(
      (e, child) => {
        control.value = e.target.value;
        if (props.onChange) {
          props.onChange(e, child);
        }
      },
      [props.onChange]
    );
    return <Select variant='outlined' {...p} ref={ref} />;
  }
);
