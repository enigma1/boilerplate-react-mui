import {red} from '@mui/material/colors'
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Typography
} from '@mui/material';

const cStrings = {
  "title": "Information Component",
  "desc": "Brief info here",
  "mainContent": "Main information section for the information component"
};

const cStyles = {
  avatar: {
    bgcolor: red[900]
  }
}

const Info = ({name}) => {
  return (
    <Paper elevation={3} sx={{my:1}}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            // <Avatar sx={{ bgcolor: red[900] }}>
            <Avatar css={cStyles.avatar}>
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
