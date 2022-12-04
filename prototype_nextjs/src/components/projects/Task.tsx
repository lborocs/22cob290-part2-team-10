import type { ProjectTaskInfo, WithAssignedToMe } from '~/types';

export type TaskProps = {
  task: WithAssignedToMe<ProjectTaskInfo>
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
