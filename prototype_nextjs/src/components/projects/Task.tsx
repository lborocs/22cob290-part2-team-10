import type { ProjectTask } from '@prisma/client';

export type TaskProps = {
  task: ProjectTask & {
    assignedToMe: boolean
    assignee: {
      name: string
    }
    tags: {
      name: string
    }[]
  }
};

// TODO: React Bootstrap Card
export default function Task({ task }: TaskProps) {
  const { title, description, tags, assignee, assignedToMe } = task;

  return (
    <div className="d-flex flex-column">
      <h1>{title}</h1>
      <p>{description}</p>
      <span>
        {tags.map((tag, index) => (
          <span key={index}>{tag.name}</span>
        ))}
      </span>
      <span>{assignee.name}</span>
      {assignedToMe && (
        <small><strong>This is my task</strong></small>
      )}
    </div>
  );
}
