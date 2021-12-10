import {
  Box,
  Container,
  Typography
} from '@mui/material';


const cStrings = {
  "demoSite": "Boilerplate for ReactJS/MUI/Webpack",
  "license": "- Made by MS (aka enigma1) - GNU/GPL v3.0 License.",
  "desc": "The content and graphics of this site are used for demonstration purposes."
};

const cStyles = {
  license: {
    color: 'blue'
  }
}

const Footer = ({name}) => {

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
        <Typography align="center" color="textPrimary" variant="subtitle2" css={cStyles.license}>
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
