import {useInternals, useSequence} from '!/useServices'
import FragmentedString from '%/Common/FragmentedString'

import Button from '@mui/material/Button';
import { Stack, Typography } from '@mui/material';

const cStrings = {
  up: '+',
  down: '-',
  value: "Current Counter is now at <strong>${unit}</strong> using a step of ${step}",
  title: 'Counter Range: Min:[<strong>${min}</strong>] Max:[<strong>${max}</strong>]'
};

const cProps = {
  title: {
    component: 'h1',
    variant: 'h4'
  },
  controls: {
    direction: 'row',
    spacing: 2,
    margin: '3px 0',
  },
  display: {
    component: 'p',
    variant: 'body2'
  }
}

const Counter = ({range, step}) => {
  const [min, max] = range;
  const {state, stateDispatch} = useInternals({
    stateParams: {cStep: 0},
  });
  const {cStep} = state;

  const onStepUp = () => {
    cStep < max && stateDispatch({cStep: cStep+step})
  }
  const onStepDown = () => {
    cStep > min && stateDispatch({cStep: cStep-step});
  }

  return(<>
    <Typography {...cProps.heading}>
      <FragmentedString string={cStrings.title} params={{min, max}} />
    </Typography>
    <Stack {...cProps.controls}>
      <Button variant="contained" onClick={onStepUp}>{cStrings.up}</Button>
      <Button variant="contained" onClick={onStepDown}>{cStrings.down}</Button>
    </Stack>
    <Typography {...cProps.display}>
      <FragmentedString string={cStrings.value} params={{unit: cStep, step}} />
    </Typography>
  </>);
}

export default Counter;
