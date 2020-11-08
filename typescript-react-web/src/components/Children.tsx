import React, { useContext } from 'react';
import { Box, Tooltip, Typography } from '@material-ui/core';
import {
  AddCircle as AddIcon,
  RemoveCircle as RemoveIcon,
} from '@material-ui/icons';

import { IconButton, DatePicker, Switch, ValidatableTextField } from './parts';
import { Context, Child as ChildModel } from '../models';

const Child = ({ model: child }: { model: ChildModel }) => {
  return (
    <Box className='childFieldset' component='fieldset'>
      <Box component='legend'>
        <Typography variant='h6'>{`子供${child.index + 1}`}</Typography>
      </Box>
      <Box>
        <Box my={2} mx={1}>
          <Tooltip title='子供の名前。'>
            <ValidatableTextField
              control={child.name}
              label='名前'
              variant='outlined'
              fullWidth
            />
          </Tooltip>
        </Box>
        <Box my={2} mx={1}>
          <Tooltip title='親と子供の関係。長男長女など。'>
            <ValidatableTextField
              control={child.relation}
              label='続柄'
              variant='outlined'
              fullWidth
            />
          </Tooltip>
        </Box>
        <Box m={2}>
          <Tooltip title='子供の生年月日。'>
            <DatePicker
              disableFuture
              label='生年月日'
              control={child.birthday}
              views={['year', 'month', 'date']}
              openTo='year'
              format='yyyy年 M月 d日'
            />
          </Tooltip>
        </Box>
        <Box my={2} mx={1}>
          <Tooltip title='[オプション] 子供の養育費。0～999,999,999,999までの数値を入力してください。'>
            <ValidatableTextField
              control={child.supportAmount}
              label='養育費'
              variant='outlined'
              fullWidth
            />
          </Tooltip>
        </Box>
        <Box m={2} display='flex'>
          <Tooltip title='[オプション] 養育費の支払い期間。設定する場合はスイッチをオンにしてください。設定しない場合は子供が成年を迎える月が適用されます。'>
            <Switch
              control={child.supportEndMonthSwitch}
              onChange={child.onSupportEndMonthSwitchChanged}
            />
          </Tooltip>
          <Tooltip title='養育費の支払いが終わる月を入力してください。'>
            <DatePicker
              label='養育費支払い終了月'
              control={child.supportEndMonth}
              views={['year', 'month']}
              openTo='year'
              format='yyyy年 M月'
            />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default () => {
  const model = useContext(Context);
  model.children.use();
  return (
    <Box m={5}>
      <Box
        className='sectionTitle'
        display='flex'
        alignItems='center'
        color='primary.contrastText'
        bgcolor='primary.main'
      >
        <Box flexGrow={1} py={1}>
          <Typography variant='h5'>未成年の子供</Typography>
        </Box>
        <Tooltip title='子供を追加'>
          <IconButton
            color='inherit'
            control={model.childrenAdd}
            onClick={model.pushChild}
          >
            <AddIcon color='inherit' />
          </IconButton>
        </Tooltip>
        <Tooltip title='子供を削除'>
          <IconButton
            color='inherit'
            control={model.childrenRemove}
            onClick={model.popChild}
          >
            <RemoveIcon color='inherit' />
          </IconButton>
        </Tooltip>
      </Box>
      <Box className='sectionContent'>
        {model.children.value.map((c) => (
          <Child key={c.index} model={c} />
        ))}
      </Box>
    </Box>
  );
};
