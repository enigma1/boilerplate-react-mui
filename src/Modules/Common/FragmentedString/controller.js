import {useSequence, useInternals} from '!/useServices'

const act = {
  services: 'utils',
  transform: (str, params) => ({
    type: 'stringsTransformer',
    data: [{str, params}]
  }),
}

const controller = ({string, params, children}) => {
  const internals = useInternals({
    viewParams: {str: string || children, params},
    dispatchers: act.services,
  });
  const {stateDispatch, middleware, view} = internals;
  const [utilsDispatch] = middleware;

  useSequence([
    [utilsDispatch, act.transform(string, params), result => {view.str = result}],
    [stateDispatch]
  ],[string, params])

  return {
    view,
    internals
  }
}

export default controller;
