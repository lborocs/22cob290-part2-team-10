/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import TaskComponent from '~/components/Task';
import type { ProjectInfo } from '~/server/store/projects';

// TODO: React Bootstrap
export default function KanbanBoard({ project }: {
  project: ProjectInfo
}) {
  const {
    name,
    manager,
    leader,
    members,
    todo,
    in_progress,
    code_review,
    completed,
  } = project;

  return (
    <div>
      {/* TOOD: put inside vertical container things */}
      <section>
        {todo.map((task, index) => (
          <TaskComponent
            key={index}
            task={task}
          />
        ))}
      </section>
    </div>
  );
}
