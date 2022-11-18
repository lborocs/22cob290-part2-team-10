import type { NextApiRequest, NextApiResponse } from 'next';

import { Role, type User } from '~/types';

type RequestSchema = {
  email: string
  password: string
}

type ResponseSchema = Partial<User>

const users: Partial<User>[] = [

];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseSchema>,
) {
  const email = 'alice@make-it-all.co.uk'; // get from req

  users.find()

  res.status(200).json({
    fname: 'John',
    lname: 'Doe',
  });
}
