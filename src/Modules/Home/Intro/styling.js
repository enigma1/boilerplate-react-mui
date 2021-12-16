import {blue} from '@mui/material/colors'

export const cStyles = {
  avatar: {
    backgroundColor: blue[900],
    fontWeight: 'bold'
  },
  divider: {
    marginBottom: '14px'
  },
  mainContent: {
    padding: '8px 54px',
    backgroundColor: blue[100]
  },
  outer: {
    margin: '3px 0',
  },
  inner: {
    backgroundColor: '#fafafa',
  }
}

export const cProps = {
  paper: {
    elevation: 3,
    css: cStyles.outer,
  },
  card: {
    variant: "outlined",
    css: cStyles.inner
  },
  mainContent: {
    component: "h2",
    variant: "body2",
    css: cStyles.mainContent
  }
}
