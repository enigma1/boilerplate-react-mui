import FragmentedString from '%/Common/FragmentedString'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

import {
  AppBar,
  Box,
  Toolbar,
  Typography
} from '@mui/material';

const Header = ({children}) => {
  return (<>
    <AppBar {...cProps.appBar}>
      <Toolbar>
        <Box css={cStyles.inner}>
          <Typography {...cProps.heading}>
            <FragmentedString string={cStrings.name}>Test</FragmentedString>
          </Typography>
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  </>);
}

export default Header;
