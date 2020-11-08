import React, { useContext } from 'react';
import { Box, InputLabel, Tooltip, Typography } from '@material-ui/core';

import {
  CoupleSelect,
  DatePicker,
  Switch,
  ValidatableTextField,
} from './parts';
import { Context } from '../models';
import { LABEL_WIDTH } from '../utils/constants';

export default () => {
  const model = useContext(Context);
  const { division } = model;
  division.use();

  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor={division.bgcolor}
      >
        <Box flexGrow={1} py={1}>
          <Typography variant='h5'>財産分与</Typography>
        </Box>
        <Box>
          <Tooltip title='財産分与を有効にするにはスイッチをオンにしてください。'>
            <Switch
              control={model.divisionSwitch}
              onChange={division.onSwitchChanged}
            />
          </Tooltip>
        </Box>
      </Box>
      <Box className='sectionContent'>
        <Box m={2}>
          <Box my={2} mx={1}>
            <Tooltip title='財産分与を支払う人を選んでください。'>
              <Box display='flex' alignItems='center'>
                <Box width={LABEL_WIDTH}>
                  <InputLabel id='division-debtor'>債務者</InputLabel>
                </Box>
                <CoupleSelect
                  className='coupleSelect'
                  labelId='division-debtor'
                  control={division.debtor}
                />
              </Box>
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title={'財産分与に支払う金額を入力してください。'}>
              <ValidatableTextField
                label='財産分与金額'
                control={division.amount}
                variant='outlined'
                fullWidth
              />
            </Tooltip>
          </Box>
          <Box m={2}>
            <Tooltip title='慰謝料の支払いは月末に固定されています。何月から支払うか入力してください。'>
              <DatePicker
                label='財産分与支払い日'
                control={division.paymentDate}
                views={['year', 'month', 'date']}
                format='yyyy年 M月 d日'
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
