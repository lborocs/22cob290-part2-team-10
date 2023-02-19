import Card from '@mui/material/Card';
import { useDrop } from 'react-dnd';
import dayjs from 'dayjs';

import { ItemTypes } from '~/types';
import Task from '~/components/project/ProjectTask';
import type { ProjectTask } from '~/pages/projects/[id]';

import styles from '~/styles/home.module.css';

interface Props {
  tasks: ProjectTask[];
  setTasks: React.Dispatch<React.SetStateAction<ProjectTask[]>>;
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
      await fetch('/api/projects/change-task-stage', {
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
