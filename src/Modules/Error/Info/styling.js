import {red} from '@mui/material/colors'

export const cStyles = {
  avatar: {
    backgroundColor: red[900],
    fontWeight: 'bold'
  },
  divider: {
    marginBottom: '14px'
  },
  mainContent: {
    padding: '8px 54px',
    backgroundColor: red[100]
  }
}


export const cProps = {
  pWrapper: {
    elevation: 3,
    margin: '3px 0',
  },
  card: {
    variant: "outlined",
  },
  mainContent: {
    component: "h2",
    variant: "body2",
    css: cStyles.mainContent
  }
}
