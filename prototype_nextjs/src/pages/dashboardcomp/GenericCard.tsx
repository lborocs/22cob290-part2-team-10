// import Box from '@mui/material/Box';
import { Divider } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface BasicCardProps {
  title: string;
  total: number;
  completed: number;
}
[];

const BasicCard = ({ title, total, completed }: BasicCardProps) => {
  const remainingTasks = total - completed;
  return (
    <Card sx={{ width: 400, marginY: 5 }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          className="font-bold text-center"
          color="text.secondary"
          gutterBottom
        >
          {title}
        </Typography>
        <Divider />
        <Typography variant="h5" component="div">
          Total Tasks: {total}
        </Typography>
        <Typography variant="h5" component="div">
          Tasks Completed: {completed}
        </Typography>
        <Typography variant="h5" component="div">
          Tasks Remaining: {remainingTasks}
        </Typography>
      </CardContent>
      <CardActions>
        {/* <Button size="small">Learn More</Button> */}
      </CardActions>
    </Card>
  );
};
// return <div>{cards}</div>;

export default BasicCard;
