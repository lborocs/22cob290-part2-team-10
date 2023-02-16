import { useDrop } from 'react-dnd';
import Card from '@mui/material/Card';

import { ItemTypes } from '~/types';

import Task from '~/components/UserTask';
import styles from '~/styles/home.module.css';

interface Props {
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  section: string;
}

interface Item {
  id: number;
}

export default function DropTarget({ tasks, setTasks, section }: Props) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.TASK,
    drop: (item: Item) => changeSection(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const changeSection = (id: number) => {
    const card = tasks.filter((task) => id === task.id);
    card[0].section = section;
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
          .filter((card) => card.section === section)
          .map((card) => (
            <Task
              key={card.id}
              id={card.id}
              title={card.tit}
              description={card.des}
              tags={card.tags}
            />
          ))}
      </div>
    </Card>
  );
}
