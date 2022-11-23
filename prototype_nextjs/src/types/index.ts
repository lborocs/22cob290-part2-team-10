// TODO: design db

export enum Role {
  MANAGER = 'MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  LEFT_COMPANY = 'LEFT_COMPANY',
}

// TODO: finalise user entity and think of a good name for this
// (User bad name cos clash with next-auth)
// then we can use this
export type User = {
  fname: string
  lname: string
  email: string
  password: string
  role: Role
};

export type UserInfo = (Omit<User, 'password'> & {
  name: string
});

// TODO: maybe return UserInfo instead of email? - that'll be solved by prisma
export type ProjectInfo = {
  id: number
  name: string
  manager: string
  leader: string
  members: string[]
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
