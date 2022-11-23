import { range } from '~/utils';

// TODO: design db

// TODO: maybe return UserInfo instead of email? - that'll be solved by prisma
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

const numProjects = 10;

const projects: ProjectInfo[] = range(1, numProjects).map((num) => ({
  name: `Project ${num}`,
  manager: 'manager@make-it-all.co.uk',
  leader: 'leader@make-it-all.co.uk',
  members: [
    'alice@make-it-all.co.uk',
  ],
  todo: [
    {
      title: 'Todo Task Title',
      description: 'Todo desc....',
      tags: ['tag1', 'tag2'],
      assignee: 'timothy',
    },
  ],
  in_progress: [
  ],
  code_review: [
  ],
  completed: [
  ],
}));

export async function getAllProjects(): Promise<ProjectInfo[]> {
  return [...projects];
}

export async function getProjectInfo(name: string): Promise<ProjectInfo | null> {
  return projects.find((project) => project.name === name) ?? null;
}

export async function getAssignedProjects(email: string): Promise<string[]> {
  return projects.filter((project) => project.members.includes(email)
    || project.manager === email
    || project.leader === email
  ).map((project) => project.name);
}
