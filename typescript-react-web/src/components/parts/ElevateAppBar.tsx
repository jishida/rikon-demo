import React from 'react';
import { AppBar, AppBarProps, useScrollTrigger } from '@material-ui/core';

export default (props: AppBarProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return React.cloneElement(<AppBar {...props} />, {
    elevation: trigger ? 4 : 0,
  });
};
