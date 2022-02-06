import FragmentedString from '%/Common/FragmentedString'
import {componentTypes, componentDefaults} from './settings';
import { Avatar, Button, Box, Container, Stack, Typography } from '@mui/material';

const Counter = ({using, cStrings, cStyles, cProps, ...props}) => {
  const {
    min, max, step,
    onStepUp, onStepDown, onReset,
    isUpDisabled, isDownDisabled, cStep,
  } = using(props);
console.log('called how many times?')
  return(<>
    <Container css={cStyles.outer}>
      <Box css={cStyles.inner}>
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
    </Container>
  </>);
}

Counter.defaultProps = componentDefaults;
Counter.propTypes = componentTypes;

export default Counter;
