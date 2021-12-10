import {
  AppBar,
  Box,
  Divider,
  Toolbar,
  Typography
} from '@mui/material';


const cStrings = {
  "name": "Main Header/Title"
};

const cStyles = {
  title: {
    flexGrow: 1
  }
}

const Header = ({name, children}) => {
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
                  {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> */}
          <Typography variant="h6" component="div" css={cStyles.title}>
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
