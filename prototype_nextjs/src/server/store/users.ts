import bcrypt from 'bcrypt';

import { Role, type User, type UserInfo } from '~/types';

const saltRounds = 10; // DO NOT INCREASE, 20 rounds takes ~1 min

async function hashPassword(raw: string): Promise<string> {
  return await bcrypt.hash(raw, saltRounds);
}

// Next.Js's SWC compiler doesn't support top-level await yet :(
const users: Promise<User[]> = (async () => [
  {
    id: '30',
    fname: 'Alice',
    lname: 'Jane',
    email: 'alice@make-it-all.co.uk',
    password: await hashPassword('TestPassword123!'),
    role: Role.TEAM_MEMBER,
  },
  {
    id: '90',
    fname: 'Jane',
    lname: 'Doe',
    email: 'member@make-it-all.co.uk',
    password: await hashPassword('TestPassword123!'),
    role: Role.TEAM_MEMBER,
  },
  {
    id: '32',
    fname: 'Matt',
    lname: 'Smith',
    email: 'leader@make-it-all.co.uk',
    password: await hashPassword('TestPassword123!'),
    role: Role.TEAM_LEADER,
  },
  {
    id: '67',
    fname: 'John',
    lname: 'Smith',
    email: 'manager@make-it-all.co.uk',
    password: await hashPassword('TestPassword123!'),
    role: Role.MANAGER,
  },
  {
    id: '2',
    fname: 'Bob',
    lname: 'Skee',
    email: 'left@make-it-all.co.uk',
    password: await hashPassword('TestPassword123!'),
    role: Role.LEFT_COMPANY,
  },
])();

// simulate getting user from db using where clause
async function getUserWhere(where: (user: User) => boolean): Promise<User | undefined> {
  return (await users).find(where);
}

export async function getAllUsers(): Promise<User[]> {
  return users;
}

export async function getUserInfo(id: string): Promise<UserInfo | undefined> {
  const user = await getUserWhere((user) => user.id === id);

  if (!user) return user;

  // omit the user's password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return {
    name: `${user.fname} ${user.lname}`,
    ...result,
  };
}

export async function getUserInfoByEmail(email: string): Promise<UserInfo | undefined> {
  const user = await getUserWhere((user) => user.email === email);

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
  const user = await getUserWhere((user) => user.email === email);

  if (!user) return null;

  return await bcrypt.compare(password, user.password);
}

export async function changePassword(email: string, newPassword: string): Promise<boolean> {
  // TODO: database
  const user = await getUserWhere((user) => user.email === email);

  if (!user) return false;

  user.password = await hashPassword(newPassword);
  return true;
}

export async function changeName(email: string, firstName: string, lastName: string): Promise<void> {
  // TODO: database
  const user = await getUserWhere((user) => user.email === email);

  if (!user) return;

  user.fname = firstName;
  user.lname = lastName;
}
