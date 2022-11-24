/* eslint-disable @typescript-eslint/no-unused-vars */ // TODO: remove once this is done
import TaskComponent from '~/components/Task';
import type { ProjectTasks } from '~/types';

// TODO: React Bootstrap
export default function KanbanBoard({ tasks }: {
  tasks: ProjectTasks
}) {

  return (
    <section className="pt-2 d-flex flex-row">
      {Object.entries(tasks).map(([taskType, tasks], index) => (
        // TODO: put inside vertical container things (can have as its own component)
        <div key={index} className="d-flex flex-column px-3" >
          <h2>{taskType}</h2>
          {
            tasks.map((task, index) => (
              <TaskComponent
                key={index}
                task={task}
              />
            ))
          }
        </div>
      ))}
    </section >
  );
}
