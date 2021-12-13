//import {useTheme} from '@emotion/react'
import cStrings from './strings.json'
import {cStyles, cProps} from './styling.js'
import Counter from '%/Common/Counter'
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

const counterOverride = () => {
  const result = useCounter({
    range: [10,30],
    step: 3
  })
  return result;
}

const headerProps = {
  avatar: <Avatar css={cStyles.avatar}>!</Avatar>,
  title: cStrings.title,
  subheader: cStrings.desc
}

const Intro = () => {
  return (
    <Paper {...cProps.pWrapper}>
      <Card {...cProps.card}>
        <CardHeader {...headerProps} />
        <CardContent>
          <Divider css={cStyles.divider} />
          <Typography {...cProps.mainContent}>{cStrings.mainContent}</Typography>
          <Counter range={[50, 100]} step={2} />
          <Counter using={counterOverride} />
        </CardContent>
      </Card>
    </Paper>
  )
}

Intro.defaultProps = {

}

export default Intro
