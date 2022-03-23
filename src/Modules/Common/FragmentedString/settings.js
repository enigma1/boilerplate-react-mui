import useDefault from './control'

const actionList = {
  $transform: {
    using: 'utils',
    action: (str, params) => ({
      type: 'stringsTransformer',
      data: [{str, params}]
    })
  }
}

export const componentDefaults = {
  using: useDefault,
  actionList
}
