import React, { useCallback } from 'react';
import {
  TextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';

import { State, ValueStateProps } from '../../utils/hooks';

export type TextFieldProps<S extends State<string>> = ValueStateProps<
  string,
  MuiTextFieldProps,
  S
>;

export default React.forwardRef<HTMLDivElement, TextFieldProps<State<string>>>(
  (props, ref) => {
    const { control, ...obj } = props;
    control.use();
    const p = obj as MuiTextFieldProps;
    p.disabled = !control.actualEnabled;
    p.value = control.value;
    p.onChange = useCallback(
      (e) => {
        control.value = e.target.value;
        if (props.onChange) {
          props.onChange(e);
        }
      },
      [props.onChange]
    );
    return <TextField {...p} ref={ref} />;
  }
);
