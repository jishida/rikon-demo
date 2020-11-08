import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
} from '@material-ui/icons';
import { Context } from '../models';
import { IconButton, ValidatableTextField } from './parts';

export default () => {
  const { config } = React.useContext(Context);
  config.use();
  return (
    <Dialog open={config.visible} fullWidth onClose={config.closeDialog}>
      <DialogTitle>設定</DialogTitle>
      <DialogContent>
        <Box p={3}>
          <Box
            className='sectionTitle'
            alignItems='center'
            color='primary.contrastText'
            bgcolor='primary.main'
            display='flex'
          >
            <Box flexGrow={1}>
              <Typography variant='h5'>略称</Typography>
            </Box>
            <Tooltip title='末尾に略称を追加'>
              <IconButton
                control={config.abbrevAdd}
                color='inherit'
                onClick={config.pushAbbrev}
              >
                <AddIcon color='inherit' />
              </IconButton>
            </Tooltip>
            <Tooltip title='末尾の略称を削除'>
              <IconButton
                control={config.abbrevRemove}
                color='inherit'
                onClick={config.popAbbrev}
              >
                <RemoveIcon color='inherit' />
              </IconButton>
            </Tooltip>
          </Box>
          <Box className='sectionContent'>
            <List>
              {config.abbrevs.map((abbrev, i) => (
                <ListItem key={i}>
                  <Tooltip title='略称を変更。甲乙丙など。'>
                    <ValidatableTextField
                      label={`略称${i + 1}`}
                      control={abbrev}
                      variant='outlined'
                      fullWidth
                    ></ValidatableTextField>
                  </Tooltip>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={config.closeDialog}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
