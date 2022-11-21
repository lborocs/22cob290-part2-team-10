import { range } from '~/utils';

export async function getAssignedProjects(email: string): Promise<string[]> {
  const numProjects = 15;

  return range(1, numProjects).map((num) => `Project ${num}`);
}

// TODO: design db
export type ProjectInfo = {
  name: string
  manager: string
  leader: string
  members: string[]
  todo: Task[]
  in_progress: Task[]
  code_review: Task[]
  completed: Task[]
};

export type Task = {
  title: string
  description: string
  tags: string[]
  assignee: string
};

const projects: ProjectInfo[] = [
  {
    name: 'Project 1',
    manager: 'bob',
    leader: 'bob',
    members: [
      'alice',
    ],
    todo: [
      {
        title: 'Todo Task Title',
        description: 'Todo desc....',
        tags: ['tag1', 'tag2'],
        assignee: 'timothy',
      },
    ],
    in_progress: [],
    code_review: [],
    completed: [],
  },
];

export async function getProjectInfo(name: string): Promise<ProjectInfo | undefined> {
  return projects.find((project) => project.name === name);
}
