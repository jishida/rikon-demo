import React from 'react';
import { Button, ButtonProps as MuiButtonProps } from '@material-ui/core';

import { ControlProps, Control } from '../../utils/hooks';

export type ButtonProps<C extends Control> = ControlProps<MuiButtonProps, C>;

export default React.forwardRef<HTMLButtonElement, ButtonProps<Control>>(
  (props, ref) => {
    const { control, ...obj } = props;
    control.use();
    const p = obj as MuiButtonProps;
    p.disabled = !control.actualEnabled;
    return <Button {...p} ref={ref} />;
  }
);
