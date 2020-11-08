import React from 'react';
import {
  IconButton,
  IconButtonProps as MuiIconButtonProps,
} from '@material-ui/core';

import { ControlProps, Control } from '../../utils/hooks';

export type IconButtonProps<C extends Control> = ControlProps<
  MuiIconButtonProps,
  C
>;

export default React.forwardRef<HTMLButtonElement, IconButtonProps<any>>(
  (props, ref) => {
    const { control, ...obj } = props;
    const p = obj as MuiIconButtonProps;
    p.disabled = !control.enabled;
    return <IconButton {...p} ref={ref} />;
  }
);
