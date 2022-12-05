import TaskComponent from '~/components/projects/Task';
import type { ProjectTasks } from '~/types';

export type KanbanBoardProps = {
  tasks: ProjectTasks
};

// TODO: React Bootstrap
export default function KanbanBoard({ tasks }: KanbanBoardProps) {

  return (
    <section className="pt-2 d-flex flex-row">
      {(Object.keys(tasks) as Array<keyof typeof tasks>)
        .map((taskStage, index) => (
          // TODO: put inside vertical container things (can have as its own component)
          <div key={index} className="d-flex flex-column px-3" >
            <h2>{taskStage}</h2>

            <div className="mt-2">
              {tasks[taskStage].map((task, index) => (
                <TaskComponent
                  key={index}
                  task={task}
                />
              ))}
            </div>
          </div>
        ))
      }
    </section >
  );
}
