import {useStrings} from '!/hooks'
import Header from '%/Common/Header'
import Footer from '%/Common/Footer'
import Intro from '%/Home/Intro'

import {
  Box,
  Container,
  Divider,
  Typography
} from '@mui/material';

const Home = ({name}) => {
  const cStrings = useStrings(name);
  return (<>
    <Container>
      <Header />
      <Box sx={{m:2}}>
        <Typography color="textPrimary" component="h1" variant="h6" gutterBottom>
          {cStrings.whatsNew}
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="body1">
          {cStrings.newsAlert}
        </Typography>
      </Box>
      <Intro />
      <Footer />
    </Container>
  </>);
}

Home.defaultProps = {
  name: Home.name
}

export default Home;
