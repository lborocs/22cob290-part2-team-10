import type { Task } from '~/types';

export type TaskProps = {
  task: Task
};

// TODO: React Bootstrap Card
export default function Task({ task }: TaskProps) {
  const { title, description, tags, assignee } = task;
  return (
    <div className="d-flex flex-column">
      <h1>{title}</h1>
      <p>{description}</p>
      <span>
        {tags.map((tag, index) => (
          <span key={index}>{tag}</span>
        ))}
      </span>
      <span>{assignee}</span>
    </div>
  );
}
