import type { Prisma } from '@prisma/client';

import { ProjectRole } from '~/types';

export function whereUserHasAccessToProject(userId: string): Prisma.ProjectWhereInput {
  return {
    OR: [
      {
        managerId: userId,
      },
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
    manager: {
      select: {
        id: true,
      }
    },
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

export function getUserRoleInProject(userId: string, project: ProjectTeam): ProjectRole | null {
  const managerId = project.manager.id;
  const leaderId = project.leader.id;

  if (managerId === userId) return ProjectRole.MANAGER;
  else if (leaderId === userId) return ProjectRole.LEADER;
  else if (project.members.find((user) => user.id === userId)) return ProjectRole.MEMBER;

  return null;
}

export function userHasAccessToProject(userId: string, project: ProjectTeam): boolean {
  return getUserRoleInProject(userId, project) !== null;
}
