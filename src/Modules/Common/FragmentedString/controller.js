import {useSequence, useInternals} from '!/useServices'

const controller = ({string, action, dispatchers, params, children}) => {
  const internals = useInternals({
    viewParams: {str: string || children, params},
    dispatchers,
  });
  const {stateDispatch, middleware, view} = internals;
  const [utilsDispatch] = middleware;

  useSequence([
    [utilsDispatch, action.transform(string, params), result => {view.str = result}],
    [stateDispatch]
  ],[string, params])

  return {
    view,
    internals
  }
}

export default controller;
