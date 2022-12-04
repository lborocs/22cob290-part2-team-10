import type { Prisma } from '@prisma/client';

import { ProjectRole, TaskStage, type ProjectTasks } from '~/types';

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

type ProjectTeam = {
  manager: {
    id: string
  }
  leader: {
    id: string
  }
  members: {
    id: string
  }[]
};

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

export function toProjectTasks(
  projectTasks: ProjectTasks[keyof ProjectTasks]
): ProjectTasks {
  const taskAcc: ProjectTasks = {
    [TaskStage.TODO]: [],
    [TaskStage.IN_PROGRESS]: [],
    [TaskStage.CODE_REVIEW]: [],
    [TaskStage.COMPLETED]: [],
  };

  return projectTasks.reduce((acc, task) => {
    acc[task.stage as TaskStage].push(task);

    return acc;
  }, taskAcc);
}
