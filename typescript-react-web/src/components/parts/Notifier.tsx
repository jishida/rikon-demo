import React from 'react';
import Snackbar, {
  SnackbarProps as MuiSnackbarProps,
} from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import Alert, { Color } from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

import { State, ControlProps } from '../../utils/hooks';

export type Serverity = Color;

export interface NotifierMessage {
  readonly key: any;
  readonly serverity: Serverity;
  readonly message: string;
}

export type NotifierProps<
  S extends State<NotifierMessage[]>
> = MuiSnackbarProps & {
  control: S;
  onCloseClick: () => void;
};

export default <S extends State<NotifierMessage[]>>(
  props: NotifierProps<S>
) => {
  const { control, onCloseClick, ...p } = props;
  control.use();
  return (
    <Snackbar open={control.value.length > 0} {...p}>
      <div>
        {control.value.map((m, i) => (
          <Alert
            key={m.key}
            severity={m.serverity}
            action={
              i === 0 ? (
                <IconButton color='inherit' size='small'>
                  <CloseIcon color='inherit' onClick={onCloseClick} />
                </IconButton>
              ) : null
            }
          >
            {m.message}
          </Alert>
        ))}
      </div>
    </Snackbar>
  );
};
