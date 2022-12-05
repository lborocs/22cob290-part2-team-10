import type { User } from 'next-auth';
import type { Prisma } from '@prisma/client';

export interface SessionUser extends User {
  id: string
  name: string
  email: string
  image: null
}

export type ErrorResponse = {
  error: string
};

// TODO: might have to change to TeamRole?
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

export type ProjectTaskInfo = Prisma.ProjectTaskGetPayload<{
  include: {
    assignee: {
      select: {
        id: true,
        name: true,
      },
    },
    tags: true,
  }
}>;

export type WithAssignedToMe<T> = T & {
  assignedToMe: boolean
};

export type ProjectTasks = {
  [k in TaskStage]: WithAssignedToMe<ProjectTaskInfo>[]
};
