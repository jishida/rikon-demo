import React, { useContext } from 'react';
import {
  Box,
  InputLabel,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';

import {
  CoupleSelect,
  DatePicker,
  Select,
  ValidatableTextField,
} from './parts';
import { Context } from '../models';
import { LABEL_WIDTH, ACTIVE_COLOR } from '../utils/constants';

export default () => {
  const model = useContext(Context);

  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor={ACTIVE_COLOR}
      >
        <Box flexGrow={1} py={1}>
          <Typography variant='h5'>各種情報</Typography>
        </Box>
      </Box>
      <Box className='sectionContent'>
        <Box m={2}>
          <Box m={2}>
            <Tooltip title='離婚協議書の作成日を入力してください。'>
              <DatePicker
                label='作成日'
                control={model.creationDate}
                views={['year', 'month', 'date']}
                format='yyyy年 M月 d日'
              />
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title='離婚届を提出する人を選択してください。'>
              <Box display='flex' alignItems='center'>
                <Box width={LABEL_WIDTH}>
                  <InputLabel id='submitter'>離婚届提出者</InputLabel>
                </Box>
                <CoupleSelect
                  className='coupleSelect'
                  labelId='submitter'
                  control={model.submitter}
                />
              </Box>
            </Tooltip>
          </Box>
          <Box m={2}>
            <Tooltip title='離婚届を提出する日付を入力してください。'>
              <DatePicker
                label='離婚届提出日'
                control={model.submissionDate}
                views={['year', 'month', 'date']}
                format='yyyy年 M月 d日'
              />
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title={'離婚届を提出する役所を入力してください。'}>
              <ValidatableTextField
                label='離婚届提出先'
                control={model.submissionDestination}
                variant='outlined'
                fullWidth
              />
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip title='公正証書にするかどうか選択してください。'>
              <Box display='flex' alignItems='center'>
                <Box width={LABEL_WIDTH}>
                  <InputLabel id='submitter'>公正証書</InputLabel>
                </Box>
                <Select labelId='submitter' control={model.notarizedDoc}>
                  <MenuItem value={1}>公正証書にする</MenuItem>
                  <MenuItem value={0}>公正証書にしない</MenuItem>
                </Select>
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
