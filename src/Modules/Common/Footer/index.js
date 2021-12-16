import FragmentedString from '%/Common/FragmentedString'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const Footer = ({fullYear}) => {
  return(<>
    <Box css={cStyles.wrapper}>
      <Container maxWidth="md">
        <Typography {...cProps.demoSite}>{cStrings.demoSite}</Typography>
        <Typography {...cProps.license}>
          <FragmentedString string={cStrings.license} params={{year:fullYear}} />
        </Typography>
        <Typography {...cProps.desc}>{cStrings.desc}</Typography>
      </Container>
    </Box>
  </>);
}

Footer.defaultProps = {
  fullYear: new Date().getFullYear()
}

export default Footer;
