import type { NextPage } from 'next';
import type { User } from 'next-auth';
import type { Prisma } from '@prisma/client';

import type { PageLayout } from '~/components/Layout';

/**
 * Workaround so we don't have to use `Layout` in every page.
 *
 * Works by adding these properties to the default export (`Component` in `App`)
 *  of the page.
 *
 * @note using the layout requires `noAuth` to be falsy
 * @see README # Part 2 # How We Need To Code # Layout/Sidebar
 */
export type AppPage<Props = any> = NextPage<Props> & {
  noAuth?: boolean
  layout?: PageLayout
};

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
