import React, { useCallback } from 'react';
import {
  TextField,
  TextFieldProps as MuiTextFieldProps,
} from '@material-ui/core';

import { ValidatableState, ValueStateProps } from '../../utils/hooks';

export type ValidatableTextFieldProps<
  S extends ValidatableState<string>
> = Omit<ValueStateProps<string, MuiTextFieldProps, S>, 'error' | 'helperText'>;

export default React.forwardRef<
  HTMLDivElement,
  ValidatableTextFieldProps<ValidatableState<string>>
>((props, ref) => {
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
  p.error = control.hasError;
  p.helperText = control.errorMessage;
  return <TextField {...p} ref={ref} />;
});
