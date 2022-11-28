// TODO: design db

// TODO: include like manhours taken

// TODO: add text-avatar colours to user

// TODO: might have to refactor how roles work if they're project specific, which it looks like they are lol

export enum Role {
  MANAGER = 'MANAGER',
  TEAM_LEADER = 'TEAM_LEADER',
  TEAM_MEMBER = 'TEAM_MEMBER',
  LEFT_COMPANY = 'LEFT_COMPANY',
}

// TOOD: implement user ID & use it to getUserInfo instead of email

// TODO: finalise user entity and think of a good name for this
// (User bad name cos clash with next-auth)
// then we can use this
export type User = {
  id: string // TODO: id might(probably?) be number
  fname: string
  lname: string
  email: string
  password: string
  role: Role
};

export type UserInfo = Omit<User, 'password'>;

// TODO: maybe return UserInfo instead of email? - that'll be solved by prisma
export type ProjectInfo = {
  id: number
  name: string
  manager: string
  leader: string
  members: string[]
  tasks: ProjectTasks
};

// additional type to make it easier to only show the tasks assigned to a certain user
export type ProjectTasks = {
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
  additional: string[] // TODO: rename (its basicalyl the ppl that can also see the task)
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
