import {useStrings} from '!/hooks'
import {red} from '@mui/material/colors'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography
} from '@mui/material';

const Info = ({name}) => {
  const cStrings = useStrings(name);
  return (
    <Paper elevation={3} sx={{my:1}}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[900] }}>
              !
            </Avatar>
          }
          title={cStrings.title}
          subheader={cStrings.desc}
        />
        <CardContent>
          <Typography component="h2" variant="body2">{cStrings.mainContent}</Typography>
        </CardContent>
      </Card>
    </Paper>
  )
}

Info.defaultProps = {
  name: Info.name,
}

export default Info