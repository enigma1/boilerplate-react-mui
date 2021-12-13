export const cStyles = {
  wrapper: {
    // backgroundColor: 'background.default',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  },
  license: {
    color: 'blue'
  }
}

export const cProps = {
  demoSite: {
    align: 'center',
    color: 'textPrimary',
    variant: 'subtitle1'
  },
 license: {
    align: 'center',
    color: 'textPrimary',
    variant: 'subtitle2',
    css: cStyles.license
  },
  desc:{
    align: 'center',
    color: 'textPrimary',
    variant: 'subtitle2',
  }
}
