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
    fname: 'Alice',
    lname: 'Jane',
    email: 'member@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.TEAM_MEMBER,
  },
  {
    fname: 'Alice',
    lname: 'Jane',
    email: 'leader@make-it-all.co.uk',
    password: 'TestPassword123!',
    role: Role.TEAM_LEADER,
  },
  {
    fname: 'Alice',
    lname: 'Jane',
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
