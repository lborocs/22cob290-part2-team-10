import type { ProjectInfo } from '~/types';
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

export async function getProjectInfo(id: number): Promise<ProjectInfo | null> {
  return projects.find((project) => project.id === id) ?? null;
}

export async function getAssignedProjects(email: string): Promise<string[]> {
  return projects.filter((project) => project.members.includes(email)
    || project.manager === email
    || project.leader === email
  ).map((project) => project.name);
}
