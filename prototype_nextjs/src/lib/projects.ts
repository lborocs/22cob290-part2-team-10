import type { Prisma } from '@prisma/client';

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
    name: string
  }
  leader: {
    id: string
  }
  members: {
    memberId: string
  }[]
};

export function userHasAccessToProject(userId: string, project: ProjectTeam): boolean {
  const managerId = project.manager.id;
  const leaderId = project.leader.id;

  const memberIds = project.members.map((projectMember: any) => projectMember.memberId);

  return managerId === userId
    || leaderId === userId
    || memberIds.includes(userId);
}
