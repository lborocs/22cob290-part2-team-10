import { useDrag } from 'react-dnd';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import dayjs, { Dayjs } from 'dayjs';

import { ItemTypes } from '~/types';

import styles from '~/styles/home.module.css';

interface Props {
  id: number;
  title: string;
  description: string;
  tags: string[];
  deadline: Dayjs;
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Task({
  id,
  title,
  description,
  tags,
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
        className={styles.taskheader}
        titleTypographyProps={{ fontSize: 16, fontWeight: 'bold' }}
        title={
          tags == null
            ? tags
            : /* Maybe get rid of this, not getting tags from db */ tags.join(
                ' '
              )
        }
        action={
          <IconButton aria-label="delete" onClick={() => handleDel(id)}>
            <DeleteIcon />
          </IconButton>
        }
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
