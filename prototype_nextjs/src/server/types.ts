import type { User } from 'next-auth';

export interface SessionUser extends User {
  id: string
  name: string
  email: string
  image: null
}
