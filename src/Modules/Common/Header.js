import {useStrings} from '!/hooks'
import {
  AppBar,
  Box,
  Divider,
  Toolbar,
  Typography
} from '@mui/material';

const Header = ({name, children}) => {
  const cStrings = useStrings(name);
  return (<>
    <AppBar position="static" sx={{mb:2}}>
      <Toolbar>
        <Box sx={{
          // backgroundColor: 'background.default',
          //mb: 8,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {cStrings.name}
          </Typography>
          {children}
        </Box>
      </Toolbar>
    </AppBar>
  </>);
}

Header.defaultProps = {
  name: Header.name,
}

export default Header;
