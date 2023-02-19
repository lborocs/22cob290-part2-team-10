import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import { ItemTypes } from '~/types';

import styles from '~/styles/home.module.css';
import dayjs, { Dayjs } from 'dayjs';
import { useDrag } from 'react-dnd';

interface Props {
  id: number;
  title: string;
  description: string;
  deadline: Dayjs;
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Task({
  id,
  title,
  description,
  deadline,
  tasks,
  setTasks,
}: Props) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  async function handleDel(id: number) {
    try {
      await fetch('/api/project/delete-project-task', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error(error);
    }
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return (
    <Card
      ref={drag}
      className={styles.taskcard}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <CardHeader
        className={styles.tasktitle}
        titleTypographyProps={{ fontSize: 20.8, fontWeight: 'bold' }}
        title={title}
        action={
          <IconButton aria-label="delete" onClick={() => handleDel(id)}>
            <DeleteIcon />
          </IconButton>
        }
      />
      <CardContent>
        <div className={styles.taskscroll}>
          <Typography className={styles.taskcontent}>{description}</Typography>
        </div>
      </CardContent>
      <CardActions>
        <Typography className={styles.deadline}>
          Deadline: {dayjs(deadline).format('hh:mma DD/MM/YYYY')}
        </Typography>
      </CardActions>
    </Card>
  );
}
