import type { Prisma } from '@prisma/client';

import { ProjectRole } from '~/types';

// TODO
export async function getProjectTasks() {

}

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
            memberId: userId,
          },
        },
      },
    ],
  };
}

type ProjectTeam = {
  manager: {
    id: string
  }
  leader: {
    id: string
  }
  members: {
    memberId: string
  }[]
};

export function getUserRoleInProject(userId: string, project: ProjectTeam): ProjectRole | null {
  const managerId = project.manager.id;
  const leaderId = project.leader.id;

  const memberIds = project.members.map((projectMember) => projectMember.memberId);

  if (managerId === userId) return ProjectRole.MANAGER;
  else if (leaderId === userId) return ProjectRole.LEADER;
  else if (memberIds.includes(userId)) return ProjectRole.MEMBER;

  return null;
}

export function userHasAccessToProject(userId: string, project: ProjectTeam): boolean {
  return getUserRoleInProject(userId, project) !== null;
}
