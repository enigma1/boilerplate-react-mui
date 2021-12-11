import {useInternals, useSequence} from '!/useServices'
import FragmentedString from '%/Common/FragmentedString'

import Button from '@mui/material/Button';
import { Avatar, Box, Stack, Typography } from '@mui/material';

const cStrings = {
  up: '+',
  down: '-',
  reset: 'Reset',
  value: "Current Counter is now at <strong>${unit}</strong> using a step of ${step}",
  title: 'Counter Range: Min:[<strong>${min}</strong>] Max:[<strong>${max}</strong>]'
};

const cStyles = {
  wrapper: {
    flexDirection: 'column',
    marginTop: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#FCFFFF',
    border: '1px solid #399',
    borderRadius: '12px'
  },
  buttonIndex: {
    fontWeight: 'bold'
  }
};

const cProps = {
  heading: {
    component: 'h2',
    variant: 'h6'
  },
  controls: {
    direction: 'row',
    spacing: 2,
    margin: '3px 0',
    alignItems: 'center'
  },
  display: {
    component: 'p',
    variant: 'body2'
  }
}

const Counter = ({range, step}) => {
  const [min, max] = range;
  const {state, stateDispatch} = useInternals({
    stateParams: {cStep: min, bUp: true, bDown: false},
  });
  const {cStep} = state;

  const onStepUp = () => {
    cStep < max && stateDispatch({cStep: cStep+step})
  }
  const onStepDown = () => {
    cStep > min && stateDispatch({cStep: cStep-step});
  }

  const onReset = () => {
    stateDispatch({cStep: min})
  }

  return(<>
    <Box container css={{...cStyles.wrapper}}>
      <Typography {...cProps.heading}>
        <FragmentedString string={cStrings.title} params={{min, max}} />
      </Typography>
      <Stack {...cProps.controls}>
        <Button css={{...cStyles.buttonIndex}} variant="contained" onClick={onStepDown} disabled={cStep <= min}>{cStrings.down}</Button>
        <Avatar>{cStep}</Avatar>
        <Button css={{...cStyles.buttonIndex}} variant="contained" onClick={onStepUp} disabled={cStep >= max}>{cStrings.up}</Button>
        <Button variant="contained" onClick={onReset}>{cStrings.reset}</Button>
      </Stack>
      <Typography {...cProps.display}>
        <FragmentedString string={cStrings.value} params={{unit: cStep, step}} />
      </Typography>
    </Box>
  </>);
}

export default Counter;
