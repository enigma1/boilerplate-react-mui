import FragmentedString from '%/Common/FragmentedString'
import {componentTypes, componentDefaults} from './settings';

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const Footer = ({cStrings, cStyles, cProps, fullYear}) => {
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

Footer.defaultProps = componentDefaults;
Footer.propTypes = componentTypes;


export default Footer;
