//import {useTheme} from '@emotion/react'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling.js'
import Counter from '%/Common/Counter'
import Timer from '%/Common/Timer'
import useCounter from '%/Common/Counter/controller'

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Typography
} from '@mui/material';

const counterOverride = () => useCounter({
  range: [10,30],
  step: 3
});

const headerProps = {
  avatar: <Avatar css={cStyles.avatar}>!</Avatar>,
  title: cStrings.title,
  subheader: cStrings.desc
}

const Intro = () => {
  return (
    <Paper {...cProps.paper}>
      <Card {...cProps.card}>
        <CardHeader {...headerProps} />
        <CardContent>
          <Divider css={cStyles.divider} />
          <Typography {...cProps.mainContent}>{cStrings.mainContent}</Typography>
          <Counter range={[50, 100]} step={2} />
          <Counter using={counterOverride} />
          <Timer css={{padding: '0 80px'}} interval={200} counters={[
            {dir: -2, min: 3, max: -10},
            {dir: 3, min: 8, max: 21},
            {dir: -5, min: 13, max: 44},
          ]} />
        </CardContent>
      </Card>
    </Paper>
  )
}

Intro.defaultProps = {}

export default Intro
