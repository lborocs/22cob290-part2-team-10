import type { NextPage } from 'next';
import type { User } from 'next-auth';
import type { Prisma } from '@prisma/client';

import type { PageLayout } from '~/components/Layout';

/**
 * Workaround so we don't have to use `Layout` in every page.
 *
 * Works by adding these properties to the default export (`Component` in `_app`)
 *  of the page.
 *
 * @note using the layout requires `noAuth` to be falsy
 * @see README # Part 2 # How We Need To Code # Layout/Sidebar
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type AppPage<Props = {}> = NextPage<Props> & {
  noAuth?: boolean
  layout?: PageLayout
};

export interface SessionUser extends User {
  id: string
  name: string
  email: string
  image: null
  isManager: boolean
}

export type ErrorResponse = {
  error: string
};

export enum ProjectRole {
  LEADER,
  MEMBER,
}

export enum TaskStage {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  CODE_REVIEW = 'CODE_REVIEW',
  COMPLETED = 'COMPLETED',
}
