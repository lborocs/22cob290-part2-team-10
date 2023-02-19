import { useDrop } from 'react-dnd';
import Card from '@mui/material/Card';

import { ItemTypes } from '~/types';

import Task from '~/components/ProjectTask';
import styles from '~/styles/home.module.css';

interface Props {
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  stage: string;
}

interface Item {
  id: number;
}

export default function DropTarget({ tasks, setTasks, stage }: Props) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: Item) => changeSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const changeSection = (id: number) => {
    const card = tasks.filter((task) => id === task.id);
    card[0].stage = stage;
    setTasks((tasks) => [...tasks]);
  };

  return (
    <Card
      ref={drop}
      className={styles.cardcontent}
      style={{ border: isOver ? '1px solid red' : '0px solid gray' }}
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
              tags={card.tags}
              deadline={card.deadline}
            />
          ))}
      </div>
    </Card>
  );
}
