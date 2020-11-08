import React from 'react';
import { Box, MenuItem, Select, SelectProps } from '@material-ui/core';

import { State, ValueStateProps } from '../../utils/hooks';
import { Couple, coupleTitles } from '../../utils/constants';

export type CoupleSelectProps<S extends State<Couple>> = ValueStateProps<
  Couple,
  SelectProps,
  S
>;

export default React.forwardRef<unknown, CoupleSelectProps<State<Couple>>>(
  (props, ref) => {
    const { control, ...obj } = props;
    control.use();
    const p = obj as SelectProps;
    p.disabled = !control.actualEnabled;
    p.value = control.value;
    p.onChange = React.useCallback(
      (e, child) => {
        control.value = e.target.value as Couple;
        if (props.onChange) {
          props.onChange(e, child);
        }
      },
      [props.onChange]
    );
    return (
      <Select variant='outlined' {...p} ref={ref}>
        {Array.from(coupleTitles.entries()).map(([key, value]) => (
          <MenuItem key={key} value={key}>
            {value}
          </MenuItem>
        ))}
      </Select>
    );
  }
);
