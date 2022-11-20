// TODO: might have to change if roles are scoped to projects
export type User = {
  fname: string
  lname: string
  email: string
  password: string
  role: Role
};

export enum Role {
  MANAGER = 'MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  LEFT_COMPANY = 'LEFT_COMPANY',
}
