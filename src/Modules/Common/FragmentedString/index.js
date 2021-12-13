import useDefault from './controller'

const FragmentedString = ({using, ...props}) => {
  const {view} = using(props);

  return(
    <span dangerouslySetInnerHTML={{__html: view.str}} />
  )
};

FragmentedString.defaultProps = {
  services: 'utils',
  using: useDefault,
}
export default FragmentedString;
