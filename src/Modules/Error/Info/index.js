import cStrings from './strings.json'
import {cStyles, cProps} from './styling'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Typography
} from '@mui/material';

const headerProps = {
  avatar: <Avatar css={cStyles.avatar}>!</Avatar>,
  title: cStrings.title,
  subheader: cStrings.desc
}

const Info = () => {
  return (
    <Paper {...cProps.pWrapper}>
    <Card {...cProps.card}>
      <CardHeader {...headerProps} />
      <CardContent>
        <Divider css={cStyles.divider} />
        <Typography {...cProps.mainContent}>{cStrings.mainContent}</Typography>
      </CardContent>
    </Card>
    </Paper>
  )
}

export default Info
