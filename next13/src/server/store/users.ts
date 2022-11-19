import { Role, type User } from '~/types';

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
