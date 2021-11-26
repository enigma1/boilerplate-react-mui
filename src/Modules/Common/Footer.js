import {useStrings} from '!/hooks'

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const Footer = ({name}) => {
  const cStrings = useStrings(name);
  return(<>
    <Box sx={{
      backgroundColor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center'
    }}>
      <Container maxWidth="md">
        <Typography align="center" color="textPrimary" variant="subtitle1">
          {cStrings.demoSite}
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle2">
            {cStrings.license}
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle2">
          {cStrings.desc}
        </Typography>
      </Container>
    </Box>
  </>);
}

Footer.defaultProps = {
  name: Footer.name,
}

export default Footer;
