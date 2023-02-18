import { useDrag } from 'react-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';

import { ItemTypes } from '~/types';

import styles from '~/styles/home.module.css';

interface Props {
  id: number;
  title: string;
  description: string;
  tags: string[];
  deadline: Dayjs;
}

export default function Task({
  id,
  title,
  description,
  tags,
  deadline,
}: Props) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <Card
      ref={drag}
      className={styles.taskcard}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <CardHeader
        className={styles.taskheader}
        titleTypographyProps={{ fontSize: 16, fontWeight: 'bold' }}
        title={tags == null ? tags : tags.join(' ')}
      />
      <CardContent>
        <Typography className={styles.tasktitle}>{title}</Typography>
        <div className={styles.taskscroll}>
          <Typography className={styles.taskcontent}>{description}</Typography>
        </div>
      </CardContent>
      <CardActions>
        <Typography>
          Deadline: {dayjs(deadline).format('HH:mm DD/MM/YYYY')}
        </Typography>
      </CardActions>
    </Card>
  );
}
