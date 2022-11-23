import { Role } from '~/types';

// would like to have this in ~/types but that can be after user entity is finalised
// and we've thought of a good name for this (User bad name cos clash with next-auth)
export type User = {
  fname: string
  lname: string
  email: string
  password: string
  role: Role
};

const users: User[] = [
  {
    fname: 'Alice',
    lname: 'Jane',
    email: 'alice@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.TEAM_MEMBER,
  },
  {
    fname: 'Jane',
    lname: 'Doe',
    email: 'member@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.TEAM_MEMBER,
  },
  {
    fname: 'Matt',
    lname: 'Smith',
    email: 'leader@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.TEAM_LEADER,
  },
  {
    fname: 'John',
    lname: 'Smith',
    email: 'manager@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.MANAGER,
  },
  {
    fname: 'Bob',
    lname: 'Skee',
    email: 'left@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.LEFT_COMPANY,
  },
];

export async function getAllUsers(): Promise<User[]> {
  return users;
}

export type UserInfo = (Omit<User, 'password'> & {
  name: string
});

export async function getUserInfo(email: string): Promise<UserInfo | undefined> {
  const user = users.find((user) => user.email === email);

  if (!user) return user;

  // omit the password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return {
    name: `${user.fname} ${user.lname}`,
    ...result,
  };
}

export async function correctPassword(email: string, password: string): Promise<boolean | null> {
  const user = users.find((user) => user.email === email);

  if (!user) return null;

  return user.password === password;
}

export async function changePassword(email: string, newPassword: string): Promise<void> {
  // TODO: database
}
