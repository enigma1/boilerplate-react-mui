export const cStyles = {
  outer: {
    marginTop: 8,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center'
  },
  title: {
    flexGrow: 1
  }
}

export const cProps = {
  appBar: {
    position: "static",
    css: cStyles.outer,
  },
  heading: {
    variant:"h6",
    component:"div",
    css: cStyles.title
  }
}
