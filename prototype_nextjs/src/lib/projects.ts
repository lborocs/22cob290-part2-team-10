import type { Prisma } from '@prisma/client';

import { ProjectRole } from '~/types';

export function whereEmployeeHasAccessToProject(userId: string): Prisma.ProjectWhereInput {
  return {
    OR: [
      {
        leaderId: userId,
      },
      {
        members: {
          some: {
            id: userId,
          },
        },
      },
    ],
  };
}

type ProjectTeam = Prisma.ProjectGetPayload<{
  select: {
    leader: {
      select: {
        id: true,
      }
    },
    members: {
      select: {
        id: true,
      }
    },
  }
}>;

export function getEmployeeRoleInProject(userId: string, project: ProjectTeam): ProjectRole | null {
  const leaderId = project.leader.id;

  if (leaderId === userId) return ProjectRole.LEADER;
  else if (project.members.find((user) => user.id === userId)) return ProjectRole.MEMBER;

  return null;
}

export function emmployeeHasAccessToProject(userId: string, project: ProjectTeam): boolean {
  return getEmployeeRoleInProject(userId, project) !== null;
}
