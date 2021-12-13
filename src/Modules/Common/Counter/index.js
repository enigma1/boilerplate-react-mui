import FragmentedString from '%/Common/FragmentedString'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'
import useDefault from './controller'
import { Avatar, Button, Box, Stack, Typography } from '@mui/material';

const Counter = ({using, ...props}) => {
  const {
    min, max, step,
    onStepUp, onStepDown, onReset,
    isUpDisabled, isDownDisabled, cStep,
  } = using(props);

  return(<>
    <Box container css={cStyles.wrapper}>
      <Typography {...cProps.heading}>
        <FragmentedString string={cStrings.title} params={{min, max, steps: Math.max(min,Math.trunc(max-min)/step)}} />
      </Typography>
      <Stack {...cProps.controls}>
        <Button css={cStyles.buttonIndex} variant="contained" onClick={onStepDown} disabled={isDownDisabled}>{cStrings.down}</Button>
        <Avatar>{cStep}</Avatar>
        <Button css={cStyles.buttonIndex} variant="contained" onClick={onStepUp} disabled={isUpDisabled}>{cStrings.up}</Button>
        <Button variant="contained" onClick={onReset} disabled={isDownDisabled}>{cStrings.reset}</Button>
      </Stack>
      <Typography {...cProps.display}>
        <FragmentedString string={cStrings.value} params={{unit: cStep, step}} />
      </Typography>
    </Box>
  </>);
}

Counter.defaultProps = {
  name: Counter.name,
  using: useDefault,
}

export default Counter;
