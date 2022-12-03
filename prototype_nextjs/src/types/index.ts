import type { User } from '@prisma/client';

export type ExposedUser = Omit<User, 'hashedPassword' | 'inviterId'>;

// inspired by https://www.prisma.io/docs/concepts/components/prisma-client/computed-fields
export function computeExposedUser(user: User): ExposedUser {
  const { hashedPassword, inviterId, ...exposedUser } = user;
  return exposedUser;
}

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

// additional type to make it easier to only show the tasks assigned to a certain user
export type ProjectTasks = {
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
