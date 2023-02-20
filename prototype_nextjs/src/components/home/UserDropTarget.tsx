import { useDrop } from 'react-dnd';
import Card from '@mui/material/Card';

import { ItemTypes } from '~/types';
import type { UserTask } from '~/pages/home';
import Task from '~/components/home/UserTask';

import styles from '~/styles/home.module.css';
import dayjs from 'dayjs';

interface Props {
  tasks: UserTask[];
  setTasks: React.Dispatch<React.SetStateAction<UserTask[]>>;
  stage: string;
}

interface Item {
  id: number;
}

export default function DropTarget({ tasks, setTasks, stage }: Props) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: Item) => {
      changeSection(item.id), changeStage(item.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const changeSection = (id: number) => {
    const card = tasks.filter((task) => id === task.id);
    card[0].stage = stage;
    setTasks((tasks) => [...tasks]);
  };

  async function changeStage(id: number) {
    try {
      await fetch('/api/user/task/change-stage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, stage }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Card
      ref={drop}
      className={styles.cardcontent}
      style={{ border: isOver ? '1px solid #e2ba39' : '0px solid gray' }}
    >
      <div className={styles.scroll}>
        {tasks
          .filter((card) => card.stage === stage)
          .map((card) => (
            <Task
              key={card.id}
              id={card.id}
              title={card.title}
              description={card.description}
              deadline={dayjs(card.deadline)}
              setTasks={setTasks}
            />
          ))}
      </div>
    </Card>
  );
}
