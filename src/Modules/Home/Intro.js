import {useInternals} from '!/useServices'
//import {useTheme} from '@emotion/react'
import Counter from '%/Common/Counter'
import {useTheme} from '@mui/material'
import {blue} from '@mui/material/colors'

import {
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  Typography
} from '@mui/material';

const cStrings = {
  "title": "Introduction Component",
  "desc": "Short description here",
  "mainContent": "Main content text for introduction component"
};

const cStyles = {
  avatar: {
    backgroundColor: blue[900],
    fontWeight: 'bold'
  },
  mainContent: {
    padding: '8px 54px 8px 54px;',
    backgroundColor: blue[100]
  }
}

const Intro = ({name}) => {
  const theme = useTheme(cStyles);

  //console.log('test', test)
  return (
    <Paper elevation={3} sx={{my:1}}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar css={cStyles.avatar}>
              !
            </Avatar>
          }
          title={cStrings.title}
          subheader={cStrings.desc}
        />
        <CardContent>
          <Typography component="h2" variant="body2" css={[theme.contentHead, cStyles.mainContent]}>{cStrings.mainContent}</Typography>
          <Counter range={[10, 20]} step={2} />
        </CardContent>
      </Card>
    </Paper>
  )
}

Intro.defaultProps = {
  name: Intro.name,
}

export default Intro