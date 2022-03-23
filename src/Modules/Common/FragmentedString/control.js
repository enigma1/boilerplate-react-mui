import {useSequence, useInternals} from '!/useServices'

const control = ({actionList, string, params, children}) => {
  const internals = useInternals({
    stateParams: {convertedString: ''},
    actionList
  });
  const {state, actions, stage} = internals;
  const {convertedString} = state;
  const {$transform, $default} = actions;

  useSequence([
    [$transform(string?string:children, params), s => stage({convertedString: s})],
  ],[string, children, params], $default)

  return {
    convertedString,
    internals
  }
}

export default control;
