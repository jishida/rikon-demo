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
  const { solatium } = model;
  solatium.use();

  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor={solatium.bgcolor}
      >
        <Box flexGrow={1} py={1}>
          <Typography variant='h5'>慰謝料</Typography>
        </Box>
        <Box>
          <Tooltip title='慰謝料を有効にするにはスイッチをオンにしてください。'>
            <Switch
              control={model.solatiumSwitch}
              onChange={solatium.onSwitchChanged}
            />
          </Tooltip>
        </Box>
      </Box>
      <Box className='sectionContent'>
        <Box m={2}>
          <Box my={2} mx={1}>
            <Tooltip title='慰謝料を支払う人を選んでください。'>
              <Box display='flex' alignItems='center'>
                <Box width={LABEL_WIDTH}>
                  <InputLabel id='solatium-debtor'>債務者</InputLabel>
                </Box>
                <CoupleSelect
                  className='coupleSelect'
                  labelId='solatium-debtor'
                  control={solatium.debtor}
                />
              </Box>
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title={'分割払いの場合一回分の金額を入力してください。'}>
              <ValidatableTextField
                label='慰謝料'
                control={solatium.amount}
                variant='outlined'
                fullWidth
              />
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title='慰謝料支払いの分割回数。1～999までの数値を入力してください。一括払いの場合は 1 を入力してください。'>
              <ValidatableTextField
                label='慰謝料支払い回数'
                control={solatium.count}
                variant='outlined'
                type='number'
                fullWidth
              />
            </Tooltip>
          </Box>
          <Box m={2}>
            <Tooltip title='慰謝料の支払いは月末に固定されています。何月から支払うか入力してください。'>
              <DatePicker
                label='慰謝料支払い開始月'
                control={solatium.startMonth}
                views={['year', 'month']}
                format='yyyy年 M月'
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
