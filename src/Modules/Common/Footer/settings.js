import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

export const componentTypes = {
  fullYear: PropTypes.number.isRequired,
  cStrings: PropTypes.object.isRequired,
  cStyles: PropTypes.object.isRequired,
  cProps: PropTypes.object.isRequired,
};

export const componentDefaults = {
  fullYear: new Date().getFullYear(),
  cStyles,
  cProps,
  cStrings,
}
