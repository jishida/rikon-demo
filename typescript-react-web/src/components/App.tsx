import React from 'react';
import { Box, Toolbar, Container, Typography } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Print as PrintIcon, Settings as ConfigIcon } from '@material-ui/icons';
import locale from 'date-fns/locale/ja';

import { Context } from '../models';
import { Button, ElevateAppBar, Notifier } from './parts';
import Parent from './Parent';
import Misc from './Misc';
import Children from './Children';
import ParentalAuthority from './ParentalAuthority';
import Solatium from './Solatium';
import Division from './Division';
import Meeting from './Meeting';
import Config from './Config';
import { LocalizeUtils } from '../utils/localize';

export default () => {
  const model = React.useContext(Context);
  return (
    <MuiPickersUtilsProvider utils={LocalizeUtils} locale={locale}>
      <Box>
        <ElevateAppBar>
          <Toolbar>
            <Box ml={3} flexGrow={1}>
              <Typography variant='h4' noWrap>
                離婚協議書作成デモ
              </Typography>
            </Box>
            <Box p={1}>
              <Button
                variant='contained'
                control={model.printButton}
                color='default'
                startIcon={<PrintIcon />}
                onClick={model.printWithLiteral}
              >
                印刷
              </Button>
            </Box>
            <Box p={1}>
              <Button
                variant='contained'
                control={model.configButton}
                color='default'
                startIcon={<ConfigIcon />}
                onClick={model.config.showDialog}
              >
                設定
              </Button>
            </Box>
          </Toolbar>
        </ElevateAppBar>
        <Toolbar />
        <Container maxWidth='md'>
          <Box p={1}>
            <Parent isHasband={true} />
            <Parent isHasband={false} />
            <Misc />
            <Children />
            <ParentalAuthority />
            <Solatium />
            <Division />
            <Meeting />
          </Box>
        </Container>
        <Config />
        <Notifier
          control={model.notifications}
          onCloseClick={model.clearNotifications}
        />
      </Box>
    </MuiPickersUtilsProvider>
  );
};
