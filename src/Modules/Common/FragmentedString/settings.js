import useDefault from './controller'

const dispachers = 'utils';

const actionList = {
  transform: (str, params) => ({
    type: 'stringsTransformer',
    data: [{str, params}]
  }),
}

export const componentTypes = {
  using: PropTypes.func.isRequired,
  action: PropTypes.object.isRequired,
  dispachers: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export const componentDefaults = {
  using: useDefault,
  action: actionList,
  dispachers
}
