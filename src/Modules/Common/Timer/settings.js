import useDefault from './controller'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

const cSchema = {
  dir: 1,
  min: 0,
  max: 100
}

const msg = (pName, cName) =>
  `Invalid value supplied to ${pName} in ${cName} - Validation failed.`;

export const componentTypes = {
  using: PropTypes.func.isRequired,
  counters: (props, pName, cName) => {
    if([
      !Array.isArray(props[pName]),
      !props[pName].every(entry=>
        Object.keys(entry).every(prop =>
          prop in cSchema && Number.isInteger(entry[prop])
        )
      )
    ].some(r => r)) return new Error(msg(pName, cName));
  },
  interval: (props, pName, cName) => {
    if([
      !Number.isInteger(props[pName]),
      props[pName] <= 0
    ].some(r => r)) return new Error(msg(pName, cName));
  },
  cStrings: PropTypes.object.isRequired,
  cStyles: PropTypes.object.isRequired,
  cProps: PropTypes.object.isRequired,
};

export const componentDefaults = {
  using: useDefault,
  interval: 3000,
  counters: [
    {dir: 1, min: 0, max: 10}
  ],
  cStyles,
  cProps,
  cStrings,
}
