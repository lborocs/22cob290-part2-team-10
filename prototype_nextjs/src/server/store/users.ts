import { Role, type User, type UserInfo } from '~/types';

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

export async function getUserInfo(email: string): Promise<UserInfo | undefined> {
  const user = users.find((user) => user.email === email);

  if (!user) return user;

  // omit the user's password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return {
    name: `${user.fname} ${user.lname}`,
    ...result,
  };
}

export async function isCorrectPassword(email: string, password: string): Promise<boolean | null> {
  const user = users.find((user) => user.email === email);

  if (!user) return null;

  return user.password === password;
}

export async function changePassword(email: string, newPassword: string): Promise<void> {
  // TODO: database
  const user = users.find((user) => user.email === email);

  if (!user) return;

  user.password = newPassword;
}

export async function changeName(email: string, firstName: string, lastName: string): Promise<void> {
  // TODO: database
  const user = users.find((user) => user.email === email);

  if (!user) return;

  user.fname = firstName;
  user.lname = lastName;
}
