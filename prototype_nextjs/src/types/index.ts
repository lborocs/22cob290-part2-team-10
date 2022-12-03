import type { User } from 'next-auth';
import type { ProjectTask } from '@prisma/client';

export interface SessionUser extends User {
  id: string
  name: string
  email: string
  image: null
}

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

// ---------------------------------

export enum Role {
  MANAGER = 'MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  LEFT_COMPANY = 'LEFT_COMPANY',
}

// TODO: maybe return UserInfo instead of email? - that'll be solved by prisma
export type ProjectInfo = {
  id: number
  name: string
  manager: string
  leader: string
  members: string[]
  tasks: ProjectTasks
};

export type Task = {
  title: string
  description: string
  tags: string[]
  assignee: string
  additional: string[] // TODO: rename (its basicalyl the ppl that can also see the task)
};

export type Post = {
  id: number
  author: string
  datePosted: number
  title: string
  content: string
  topics: string[]
};

export type UnauthorisedResponse = {
  message: string;
};
