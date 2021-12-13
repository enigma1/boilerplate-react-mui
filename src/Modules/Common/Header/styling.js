export const cStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  },
  bar: {
    marginBottom: 2,
  },
  title: {
    flexGrow: 1
  }
}

export const cProps = {
  wrapper: {
    position: "static",
    css: cStyles.bar,
  },
  heading: {
    variant:"h6",
    component:"div",
    css: cStyles.title
  }
}
