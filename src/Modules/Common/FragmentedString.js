import {useInternals, useSequence} from '!/useServices'

const act = {
  transform: (str, params) => ({
    type: 'stringsTransformer',
    data: [{str, params}]
  }),
}

const Dummy = (value) => <>{value}</>

const FragmentedString = ({services, string, params}) => {
  const {stateDispatch, middleware, view} = useInternals({
    viewParams: {str: string, params},
    dispatchers: services,
  });

  const [utilsDispatch] = middleware;

  useSequence([
    [utilsDispatch, act.transform(string, params), result => {view.str = result}],
    [stateDispatch]
  ],[string, params])

  return(
    <Dummy dangerouslySetInnerHTML={{__html: view.str}} />
  )
};

FragmentedString.defaultProps = {
  services: 'utils'
}
export default FragmentedString;
