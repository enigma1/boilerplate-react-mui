import {useSequence, useInternals} from '!/useServices'

const act = {
  transform: (str, params) => ({
    type: 'stringsTransformer',
    data: [{str, params}]
  }),
}

const controller = ({services, string, params, children}) => {
  const internals = useInternals({
    viewParams: {str: string?string:children, params},
    dispatchers: services,
  });
  const {stateDispatch, middleware, view} = internals;
  const [utilsDispatch] = middleware;

  const transform = useSequence([
    [utilsDispatch, act.transform(string, params), result => {view.str = result}],
    [stateDispatch]
  ],[string, params])

  return {
    transform,
    stateDispatch,
    utilsDispatch,
    view,
    string,
    params,
    internals
  }
}

export default controller;
