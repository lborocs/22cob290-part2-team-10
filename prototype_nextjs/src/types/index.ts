import type { User } from 'next-auth';
import type { ProjectTask } from '@prisma/client';

export interface SessionUser extends User {
  id: string
  name: string
  email: string
  image: null
}

export type UnauthorisedResponse = {
  message: string;
};

// might have to change to TeamRole?
export enum ProjectRole {
  MANAGER,
  LEADER,
  MEMBER,
}

export enum TaskStage {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  CODE_REVIEW = 'CODE_REVIEW',
  COMPLETED = 'COMPLETED',
}

export type ProjectTaskInfo = WithAssignedToMe<(ProjectTask & {
  assignee: {
    name: string
  }
  tags: {
    name: string
  }[]
})>;

// https://www.prisma.io/docs/concepts/components/prisma-client/computed-fields
type HasAssignee = {
  assignee: {
    id: string
  }
};

type WithAssignedToMe<T> = T & {
  assignedToMe: boolean
};

// TODO: move to lib/projects?
export function computeAssignedToMe<Task extends HasAssignee>(
  task: Task,
  userId: string
): WithAssignedToMe<Task> {
  return {
    ...task,
    assignedToMe: task.assignee.id === userId,
  };
}

export type ProjectTasks = {
  [k in TaskStage]: ProjectTaskInfo[]
};
