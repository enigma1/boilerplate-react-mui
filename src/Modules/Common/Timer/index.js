import FragmentedString from '%/Common/FragmentedString'
import {componentDefaults} from './settings';
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

import {Avatar, Box, Button, Container, Stack, Typography} from '@mui/material';

const Counters = ({list}) => {
  return list.map( (count, idx) => {
    return(
      <Avatar key={`counter-${idx}`}>{`${count}`}</Avatar>
    )
  })
}

const Timer = ({using, ...props}) => {
  const {
    iterations,
    isPaused,
    isRunning,
    onToggle, onReset,
    counters
  } = using(props);

  return (<>
  <Container css={cStyles.outer}>
    <Box css={cStyles.inner}>
      <Typography {...cProps.heading}>
        <FragmentedString string={cStrings.title} params={{}} />
      </Typography>
      <Stack {...cProps.controls}>
        <Button variant="contained" css={cStyles.buttonIndex} onClick={onToggle}>{isRunning?cStrings.pause:cStrings.run}</Button>
        <Counters list={counters} />
        <Button variant="contained" onClick={onReset} disabled={!isPaused}>{cStrings.reset}</Button>
      </Stack>
      <Typography {...cProps.display}>
        <FragmentedString string={cStrings.counters} params={{size: counters.length, interval: props.interval, iterations}} />
      </Typography>
    </Box>
    </Container>
  </>)
}

Timer.defaultProps = componentDefaults;

export default Timer;