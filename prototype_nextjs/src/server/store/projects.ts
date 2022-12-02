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
    'test@make-it-all.co.uk',
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
})).concat([
  {
    id: 30,
    name: 'Alice should not see this',
    manager: 'manager@make-it-all.co.uk',
    leader: 'leader@make-it-all.co.uk',
    members: [
      'test@make-it-all.co.uk',
    ],
    tasks: {
      todo: [
      ],
      in_progress: [
      ],
      code_review: [
      ],
      completed: [
      ],
    },
  },
])

export async function getAllProjects(): Promise<ProjectInfo[]> {
  return [...projects];
}

// TODO: convert id to string? depends on prisma i guess
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

// TODO: change to user id
export async function userHasAccessToProject(email: string, projectId: number): Promise<boolean> {
  const project = await getProjectInfo(projectId);

  if (!project) return false;

  return project.manager === email
    || project.leader === email
    || project.members.includes(email)
}
