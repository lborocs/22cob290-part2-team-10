import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
// import { ok } from 'assert';

// import * as dotenv from 'dotenv';
import { hashPassword } from '~/lib/user';
import {
  // getInviteToken,
  // getEmailFromToken,
  getEmailFromTokenIfValid,
} from '~/lib/inviteToken';

const prisma = new PrismaClient();

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const data = JSON.parse(req.body);
  const hashedPassword = hashPassword.bind(null, data.password);
  data.hashedPassword = await hashedPassword();
  delete data.password;
  // console.log(data);

  const emailExists = await prisma.user.findMany({
    where: {
      email: {
        equals: data.email,
      },
    },
  });

  // const adminInviteToken = getInviteToken.bind(
  //   null,
  //   'manager@make-it-all.co.uk'
  // );

  data.inviteToken = data.inviteToken.split('invite=')[1];

  // const adminEmail = getEmailFromTokenIfValid(adminInviteToken());
  const emailFromToken = getEmailFromTokenIfValid(data.inviteToken);

  //check that a valid email is used
  if (emailFromToken != null) {
    const emailFromTokenExists = await prisma.user.findMany({
      where: {
        email: {
          equals: emailFromToken,
        },
      },
    });

    // console.log(data.inviteToken);
    // console.log(emailFromToken);
    // console.log(adminInviteToken());
    // console.log(adminEmail);

    //validation of creatign a new user on the server side
    //checks if the email of new user has not been used before,
    //the email token does not point to an invalid email and
    //the email taken from the invite token is an existing email
    if (
      emailExists.length > 0 ||
      emailFromToken == null ||
      emailFromTokenExists.length == 0
    ) {
      res.status(400).json({ message: 'Error: Check email entered.' }); // if invalid request to create a new user, for example if token not valid or email used before then send 400 error response
    } else {
      const createdUser = await prisma.user.create({
        data,
      });
      // console.log(createdUser);
      res.status(200).json(createdUser); //send response containing the created user information
      // res.json(400);
    }
  } else {
    res.status(400).json({ message: 'Error: Invalid invite token was given.' });
  }
};
