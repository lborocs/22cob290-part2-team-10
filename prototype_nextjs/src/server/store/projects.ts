import type { ProjectInfo, ProjectTasks } from '~/types';
import { range } from '~/utils';

const numProjects = 10;

const projects: ProjectInfo[] = range(1, numProjects).map((num) => ({
  id: num,
  name: `Project ${num}`,
  manager: 'manager@make-it-all.co.uk',
  leader: 'leader@make-it-all.co.uk',
  members: [
    'alice@make-it-all.co.uk',
  ],
  tasks: {
    todo: [
      {
        title: 'Todo Task Title',
        description: 'Alice shouldn\'t see this',
        tags: ['tag1', 'tag2'],
        assignee: 'timothy',
        additional: [
          '',
        ],
      },
    ],
    in_progress: [
      {
        title: 'In Progress',
        description: 'Alice should see this',
        tags: ['tag1', 'tag2'],
        assignee: 'timothy',
        additional: [
          'alice@make-it-all.co.uk',
        ],
      },
    ],
    code_review: [
    ],
    completed: [
    ],
  },
}));

export async function getAllProjects(): Promise<ProjectInfo[]> {
  return [...projects];
}

export async function getProjectInfo(id: number): Promise<ProjectInfo | null> {
  return projects.find((project) => project.id === id) ?? null;
}

// TODO: change to user id
export async function getAssignedProjects(email: string): Promise<ProjectInfo[]> {
  return projects.filter((project) => project.members.includes(email)
    || project.manager === email
    || project.leader === email
  );
}

// TODO: change to user id
export async function getAssignedTasks(email: string, project: ProjectInfo): Promise<ProjectTasks> {
  const { tasks } = project;

  const assignedTasksEntries = Object.entries(tasks).map(([taskType, tasks]) => {
    const assignedTasks = tasks.filter(
      (task) => task.assignee === email || task.additional.includes(email)
    );

    return [taskType, assignedTasks];
  });

  return Object.fromEntries(assignedTasksEntries) as ProjectTasks;
}
