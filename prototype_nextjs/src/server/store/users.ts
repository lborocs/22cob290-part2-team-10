import { Role } from '~/types';

// would like to have this in ~/types but that can be after user entity is finalised
// and thought of a good name for this (User bad name cos clash with nextauth)
export type User = {
  fname: string
  lname: string
  email: string
  password: string
  role: Role
};

/* TODO: refactor to be like a repository:

getAllUsers

getUser(email) (dont return pw?)

correctPassword(email, password) *only if not returning password^

etc.

*/

export const users: User[] = [
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

export type UserInfo = (Omit<User, 'password'> & {
  name: string
});

export function getUserInfo(email: string): UserInfo | undefined {
  const user = users.find((user) => user.email === email);

  if (!user) return user;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...result } = user;

  return {
    name: `${user.fname} ${user.lname}`,
    ...result,
  };
}
