import Header from '%/Common/Header'
import Footer from '%/Common/Footer'
import Intro from '%/Home/Intro'

import {
  Box,
  Container,
  Divider,
  Typography
} from '@mui/material';

const cStrings = {
  "whatsNew": "Home Boilerplate - ReactJS/MUI/Webpack",
  "newsAlert": "Desscription text for the home page goes here"
};

const cProps = {
  whatsNew: {
    color: "textPrimary",
    component: "h1",
    variant: "h6",
    gutterBottom: true
  },
  newsAlert: {
    color: "textSecondary",
    variant: "body1",
    gutterBottom: true
  }
}

const cStyles = {
  contentBox: {
    margin: '8px 0px;',
    padding: 16,
  }
}

const Home = ({name}) => {
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

Home.defaultProps = {
  name: Home.name,
}

export default Home;
