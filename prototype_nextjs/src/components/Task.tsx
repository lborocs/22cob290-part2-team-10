import type { Task } from '~/server/store/projects';

// TODO: React Bootstrap Card
export default function Task({ task }: {
  task: Task
}) {
  const { title, description, tags, assignee } = task;
  return (
    <div>
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
