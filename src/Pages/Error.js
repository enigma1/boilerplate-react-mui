import Header from '%/Common/Header'
import Footer from '%/Common/Footer'
import Info from '%/Error/Info'

import {
  Box,
  Container,
  Typography
} from '@mui/material';

const cStrings = {
  "title": "Error Page",
  "description": "The page you're looking for could not be found. <br />Use our menu links to navigate to the list of our products"
};

const Error = ({name}) => {
  return (<>
    <Container>
      <Header />
      <Box sx={{m:2}}>
        <Typography color="textPrimary" component="h1" variant="h6" gutterBottom>
          {cStrings.title}
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="body1">
          {cStrings.description}
        </Typography>
      </Box>
      <Info />
      <Footer />
    </Container>
  </>);
}

Error.defaultProps = {
  name: Error.name,
}

export default Error;
