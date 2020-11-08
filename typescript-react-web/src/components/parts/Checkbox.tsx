import React, { useCallback } from 'react';
import { Checkbox, CheckboxProps as MuiCheckboxProps } from '@material-ui/core';

import { State, CheckedStateProps } from '../../utils/hooks';

export type CheckboxProps<S extends State<boolean>> = CheckedStateProps<
  MuiCheckboxProps,
  S
>;

export default React.forwardRef<
  HTMLButtonElement,
  CheckboxProps<State<boolean>>
>((props, ref) => {
  const { control, ...obj } = props;
  control.use();
  const p = obj as MuiCheckboxProps;
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
  return <Checkbox {...p} ref={ref} />;
});
