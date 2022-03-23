import {useInternals} from '!/useServices'

const control = ({range, step}) => {
  const [min, max] = range;
  const internals = useInternals({stateParams: {cStep: min}});
  const {state, actions} = internals;
  const {cStep} = state
  const {$default} = actions;
  return {
    onStepUp: () => cStep < max && $default({cStep: cStep+step<max?cStep+step:max}),
    onStepDown: () => cStep > min && $default({cStep: cStep-step>min?cStep-step:min}),
    onReset: () => $default({cStep:min}),
    isUpDisabled: cStep >= max,
    isDownDisabled: cStep <= min,
    cStep,
    min, max, step,
    internals
  }
}

export default control;
