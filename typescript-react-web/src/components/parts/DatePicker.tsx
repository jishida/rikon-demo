import React, { useCallback } from 'react';
import {
  DatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@material-ui/pickers';

import { State, ValueStateProps } from '../../utils/hooks';

export type DatePickerProps<S extends State<Date>> = Omit<
  ValueStateProps<Date, MuiDatePickerProps, S>,
  'onChange'
> & {
  onChange?: (date: Date) => void;
};

export default React.forwardRef<HTMLDivElement, DatePickerProps<State<Date>>>(
  (props, ref) => {
    const { control, ...obj } = props;
    control.use();
    const p = obj as MuiDatePickerProps;
    p.disabled = !control.actualEnabled;
    p.value = control.value;
    p.onChange = useCallback(
      (date) => {
        control.value = date;
        props.onChange;
        if (props.onChange) {
          props.onChange(date);
        }
      },
      [props.onChange]
    );
    return <DatePicker {...p} ref={ref} />;
  }
);
