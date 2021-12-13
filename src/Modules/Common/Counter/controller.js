import {useInternals} from '!/useServices'

const controller = ({range, step}) => {
  const [min, max] = range;
  const internals = useInternals({stateParams: {cStep: min}});
  const {state, stateDispatch} = internals;
  const {cStep} = state
  return {
    onStepUp: () => cStep < max && stateDispatch({cStep: cStep+step<max?cStep+step:max}),
    onStepDown: () => cStep > min && stateDispatch({cStep: cStep-step>min?cStep-step:min}),
    onReset: () => stateDispatch({cStep:min}),
    isUpDisabled: cStep >= max,
    isDownDisabled: cStep <= min,
    cStep,
    min, max, step,
    internals
  }
}

export default controller;
