import FragmentedString from '%/Common/FragmentedString'
import {componentTypes, componentDefaults} from './settings';

import {
  AppBar,
  Box,
  Divider,
  Toolbar,
  Typography
} from '@mui/material';

const Header = ({children, cStrings, cProps, cStyles}) => {
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

Header.defaultProps = componentDefaults;
Header.propTypes = componentTypes;

export default Header;
