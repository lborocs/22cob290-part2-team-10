import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
// import { ok } from 'assert';

// import * as dotenv from 'dotenv';
import { hashPassword } from '~/lib/user';
import {
  getInviteToken,
  getEmailFromToken,
  getEmailFromTokenIfValid,
} from '~/lib/inviteToken';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body);
  const hashedPassword = hashPassword.bind(null, data['password']);
  data['hashedPassword'] = await hashedPassword();
  delete data['password'];
  console.log(data);

  const sameEmail = await prisma.user.findMany({
    where: {
      email: {
        equals: data['email'],
      },
    },
  });

  const emailFromToken = getEmailFromTokenIfValid(data.inviteToken);
  console.log(data.inviteToken);
  console.log(emailFromToken);

  //validation of creatign a new user on the server side
  if (sameEmail.length > 0 || emailFromToken == null) {
    res.status(400).json({ message: 'Could not complete the request' }); // if invalid request to create a new user, for example if token not valid or email used before then send 400 error response
  } else {
    const createdUser = await prisma.user.create({
      data,
    });
    res.status(200).json(createdUser);
    // res.json(400);
  }
};
