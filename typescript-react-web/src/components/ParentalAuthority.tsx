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
  const { parentalAuthority } = model;
  parentalAuthority.use();

  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor={parentalAuthority.bgcolor}
      >
        <Box py={1}>
          <Typography variant='h5'>親権</Typography>
        </Box>
      </Box>
      <Box className='sectionContent'>
        <Box m={2}>
          <Box my={2} mx={1}>
            <Tooltip title='親権をどちらが持つか選択してください。'>
              <Box display='flex' alignItems='center'>
                <Box width={LABEL_WIDTH}>
                  <InputLabel id='parent-authority'>親権者</InputLabel>
                </Box>
                <CoupleSelect
                  labelId='parent-authority'
                  className='coupleSelect'
                  control={parentalAuthority.person}
                />
              </Box>
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title='監護権をどちらが持つか選択してください。'>
              <Box display='flex' alignItems='center'>
                <Box width={LABEL_WIDTH}>
                  <InputLabel id='support-creditor'>監護権者</InputLabel>
                </Box>
                <CoupleSelect
                  labelId='support-creditor'
                  className='coupleSelect'
                  control={parentalAuthority.supportCreditor}
                />
              </Box>
            </Tooltip>
          </Box>
          <Box m={2}>
            <Tooltip title='養育費の支払いは月末に固定されています。何月から支払うか入力してください。'>
              <DatePicker
                label='養育費支払い開始月'
                control={parentalAuthority.supportStartMonth}
                views={['year', 'month']}
                format='yyyy 年M月'
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
