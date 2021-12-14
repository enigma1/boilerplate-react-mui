import cStrings from './strings.json'
import {cStyles, cProps} from './styling'

import Header from '%/Common/Header'
import Footer from '%/Common/Footer'
import Info from '%/Error/Info'

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const Error = () => {
  return (<>
    <Container>
      <Header />
      <Box css={cStyles.contentBox}>
        <Typography {...cProps.title}>{cStrings.title}</Typography>
        <Typography {...cProps.description}>{cStrings.description}</Typography>
      </Box>
      <Info />
      <Footer />
    </Container>
  </>);
}

export default Error;
