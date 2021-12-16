import FragmentedString from '%/Common/FragmentedString'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

import {
  AppBar,
  Box,
  Divider,
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

Header.defaultProps = {
}

export default Header;
