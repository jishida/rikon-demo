import React, { useContext } from 'react';
import { Box, Tooltip, Typography } from '@material-ui/core';

import { Switch, ValidatableTextField } from './parts';
import { Context } from '../models';

export default () => {
  const model = useContext(Context);
  const { meeting } = model;
  meeting.use();

  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor={meeting.bgcolor}
      >
        <Box flexGrow={1} py={1}>
          <Typography variant='h5'>面接交渉</Typography>
        </Box>
        <Box>
          <Tooltip title='子供との面接に関する内容を含めるにはスイッチをオンにしてください。'>
            <Switch
              control={model.meetingSwitch}
              onChange={meeting.onSwitchChanged}
            />
          </Tooltip>
        </Box>
      </Box>
      <Box className='sectionContent'>
        <Box m={2}>
          <Box my={2} mx={1}>
            <Tooltip
              title={
                'この[  ]内に入る文言。「面接は[      ]とし場所は甲乙協議の上決定する。」'
              }
            >
              <ValidatableTextField
                label='面接制限'
                control={meeting.meetingLimit}
                variant='outlined'
                multiline
                rows={4}
                fullWidth
              />
            </Tooltip>
          </Box>
          <Box my={2} mx={1}>
            <Tooltip
              title={
                'この[   ]内に入る文言。「(非監護権者)は、(監護権者)が、(子供)と[      ]面接交渉をすることを認める。」'
              }
            >
              <ValidatableTextField
                label='面接交渉条件'
                control={meeting.negotiationLimit}
                variant='outlined'
                multiline
                rows={4}
                fullWidth
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
