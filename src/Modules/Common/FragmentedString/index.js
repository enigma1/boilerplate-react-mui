import {componentTypes, componentDefaults} from './settings';

const FragmentedString = ({using, ...props}) => {
  const {view} = using(props);

  return(
    <span dangerouslySetInnerHTML={{__html: view.str}} />
  )
};

FragmentedString.defaultProps = componentDefaults;
FragmentedString.propTypes = componentTypes;

export default FragmentedString;
