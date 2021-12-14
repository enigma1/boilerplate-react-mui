import cStrings from './strings.json'
import {cStyles, cProps} from './styling'
import Header from '%/Common/Header'
import Footer from '%/Common/Footer'
import Intro from '%/Home/Intro'

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const Home = () => {
  return (<>
    <Container>
      <Header />
      <Box css={cStyles.contentBox}>
        <Typography {...cProps.whatsNew}>{cStrings.whatsNew}</Typography>
        <Typography {...cProps.newsAlert}>{cStrings.newsAlert}</Typography>
      </Box>
      <Intro />
      <Footer />
    </Container>
  </>);
}

export default Home;
