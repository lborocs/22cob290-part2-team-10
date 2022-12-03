import bcrypt from 'bcrypt';

import { Role, type User, type UserInfo } from '~/types';

const saltRounds = 10; // DO NOT INCREASE, 20 rounds takes ~1 min

/**
 * Hashes the provided password using bcrypt.
 *
 * @param raw
 * @returns The hashed password
 */
export async function hashPassword(raw: string): Promise<string> {
  return await bcrypt.hash(raw, saltRounds);
}

const testPassword = hashPassword('TestPassword123!');

// Next.Js's SWC compiler doesn't support top-level await yet :(
const users: Promise<User[]> = (async () => [
  {
    id: '30',
    firstName: 'Alice',
    lastName: 'Jane',
    email: 'alice@make-it-all.co.uk',
    password: await testPassword,
    role: Role.TEAM_MEMBER,
  },
  {
    id: '90',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'member@make-it-all.co.uk',
    password: await testPassword,
    role: Role.TEAM_MEMBER,
  },
  {
    id: '32',
    firstName: 'Matt',
    lastName: 'Smith',
    email: 'leader@make-it-all.co.uk',
    password: await testPassword,
    role: Role.TEAM_LEADER,
  },
  {
    id: '67',
    firstName: 'John',
    lastName: 'Smith',
    email: 'manager@make-it-all.co.uk',
    password: await testPassword,
    role: Role.MANAGER,
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Skee',
    email: 'left@make-it-all.co.uk',
    password: await testPassword,
    role: Role.LEFT_COMPANY,
  },
])();

// simulate getting user from db using where clause
async function getUserWhere(where: (user: User) => boolean): Promise<User | undefined> {
  return (await users).find(where);
}

/**
 * Returns all users.
 */
export async function getAllUsers(): Promise<User[]> {
  return users;
}

/**
 * Returns the user with the provided `id`, or `null` is none exists.
 *
 * @param id
 */
export async function getUserInfo(id: string): Promise<UserInfo | undefined> {
  const user = await getUserWhere((user) => user.id === id);

  if (!user) return user;

  // omit the user's password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return result;
}

/**
 * Returns the user with the provided `email`, or `null` is none exists.
 *
 * @param email
 */
export async function getUserInfoByEmail(email: string): Promise<UserInfo | undefined> {
  const user = await getUserWhere((user) => user.email === email);

  if (!user) return user;

  // omit the user's password
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return result;
}

/**
 * If the user with provided `id` does not exist, returns `null`.
 *
 * Else returns whether the provided `password` is correct for the user with the provided `id` or not.
 *
 * @param id
 * @param password
 */
export async function isCorrectPassword(id: string, password: string): Promise<boolean | null> {
  const user = await getUserWhere((user) => user.id === id);

  if (!user) return null;

  return await bcrypt.compare(password, user.password);
}

/**
 * Changed the password of the user with the provided `id`
 *
 * @param id
 * @param newPassword The user's new password
 */
export async function changePassword(id: string, newPassword: string): Promise<void> {
  // TODO: database
  const user = await getUserWhere((user) => user.id === id);

  if (!user) return;

  user.password = await hashPassword(newPassword);
  return;
}

/**
 * Changed the `firstName` and/or `lastName` of the user with the provided `id`
 *
 * @param id
 * @param firstName The user's new first name
 * @param lastName The user's new last name
 */
export async function changeName(id: string, firstName: string, lastName: string): Promise<void> {
  // TODO: database
  const user = await getUserWhere((user) => user.id === id);

  if (!user) return;

  user.firstName = firstName;
  user.lastName = lastName;
}
