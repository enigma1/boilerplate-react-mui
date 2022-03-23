import {componentDefaults} from './settings';

const FragmentedString = ({using, ...props}) => {
  const {convertedString} = using(props);
  return(
    <span className="fragmented-string" dangerouslySetInnerHTML={{__html: convertedString}} />
  )
};

FragmentedString.defaultProps = componentDefaults;

export default FragmentedString;
