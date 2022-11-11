export enum Role {
  MANAGER = 'MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  LEFT_COMPANY = 'LEFT_COMPANY',
}

export type User = {
  email: string
  role: Role
};
