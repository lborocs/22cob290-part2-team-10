import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function BasicCard(props: { data: any }) {
  const data = props.data;
  const cards = data.map(
    (
      item: {
        title:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactFragment
          | React.ReactPortal
          | null
          | undefined;
        description:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | React.ReactFragment
          | React.ReactPortal
          | null
          | undefined;
      },
      index: React.Key | null | undefined
    ) => {
      return (
        <Card sx={{ width: 400, marginY: 5 }} key={index}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {item.title}
            </Typography>
            <Typography variant="h5" component="div">
              {item.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      );
    }
  );
  return <div>{cards}</div>;
}
export default BasicCard;
