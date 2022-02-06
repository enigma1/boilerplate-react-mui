import useDefault from './controller'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

const msg = (pName, cName) =>
  `Invalid value supplied to ${pName} in ${cName} - Validation failed.`;

export const componentTypes = {
  using: PropTypes.func.isRequired,
  range: (props, pName, cName) => {
    if([
      !Array.isArray(props[pName]),
      !props[pName].every(i=>Number.isInteger(i))
    ].some(r => r)) return new Error(msg(pName, cName));
  },
  step: (props, pName, cName) => {
    if(!Number.isInteger(props[pName])) {
      return new Error(msg(pName, cName));
    }
  },
  cStrings: PropTypes.object.isRequired,
  cStyles: PropTypes.object.isRequired,
  cProps: PropTypes.object.isRequired,
};

export const componentDefaults = {
  using: useDefault,
  range: [20, 80],
  step: 1,
  cStyles,
  cProps,
  cStrings,
}
