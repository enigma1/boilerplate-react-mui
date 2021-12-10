import {useInternals, useSequence} from '!/useServices'

const act = {
  transform: (str, params) => ({
    type: 'convertStrings',
    data: [{str, params}]
  }),
  sanitize: data => ({
    type: 'sanitize',
    data
  })
}

const FragmentedString = ({service, string, params}) => {

  const {state, stateDispatch, middleware, view} = useInternals({
    viewParams: {str: string, params},
    dispatchers: service,

  });

  const [utilsDispatch] = middleware;

  useSequence([
    [utilsDispatch, act.transform(string, params), s => act.sanitize(s)],
    [utilsDispatch,,s => view.str=s],
    [stateDispatch]
  ],[string, params])

  return(
    <span dangerouslySetInnerHTML={{__html: view.str}} />
  )
};

FragmentedString.defaultProps = {
  service: 'utils'
}
export default FragmentedString;
