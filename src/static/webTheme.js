// Default properties @ https://mui.com/customization/default-theme/

import {createTheme} from '@mui/material/styles'
import orange from '@mui/material/colors/orange';

const webTheme = createTheme({
  spacing: [0, 4, 8, 16, 32, 64],
  palette: {
    primary: orange,
  },
  contentHead: {
    marginTop: 14,
    borderRadius: 8,
    padding: 28,
    boxShadow: '4px 4px gray;',
    backgroundColor: orange[400]
  }
})

export default webTheme
