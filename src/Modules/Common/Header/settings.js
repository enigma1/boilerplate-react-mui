import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

export const componentTypes = {
  cStrings: PropTypes.object.isRequired,
  cStyles: PropTypes.object.isRequired,
  cProps: PropTypes.object.isRequired,
};

export const componentDefaults = {
  cStyles,
  cProps,
  cStrings,
}
