import React, { useContext } from 'react';
import { Box, Tooltip, Typography } from '@material-ui/core';

import { ValidatableTextField } from './parts';
import { Context } from '../models';

export interface ParentProps {
  isHasband: boolean;
}

export default ({ isHasband }: ParentProps) => {
  const model = useContext(Context);
  const parent = model.couple[isHasband ? 0 : 1];

  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor='primary.main'
      >
        <Box py={1}>
          <Typography variant='h5'>{parent.title}</Typography>
        </Box>
      </Box>
      <Box className='sectionContent'>
        <Box m={2}>
          <Tooltip title={`${parent.title}の名前`}>
            <ValidatableTextField
              label='名前'
              control={parent.name}
              variant='outlined'
              fullWidth
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
