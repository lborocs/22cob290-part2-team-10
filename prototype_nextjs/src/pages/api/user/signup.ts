import type { NextApiRequest, NextApiResponse } from 'next';
import type { Prisma, User } from '@prisma/client';

import SignUpSchema from '~/schemas/user/signup';
import prisma from '~/lib/prisma';
import { hashPassword } from '~/lib/user';
import { getEmailFromTokenIfValid } from '~/lib/inviteToken';

export type SignupResponse = User | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>
) {
  /*
  This is a server-side code written in Node.js and uses Next.js API to
  handle user creation. The code uses the Prisma Client library to interact
  with the database. It receives a request with a JSON body, parses it
  and creates a new user in the database. Before creating a new user, it performs
  several validations to ensure that the request is valid.
  */
  const user = SignUpSchema.parse(req.body);
  const data: Prisma.UserCreateInput = {
    name: user.name,
    email: user.email,
    inviteToken: user.inviteToken,
    hashedPassword: await hashPassword(user.password),
  };

  const emailExists = await prisma.user.findMany({
    where: {
      email: {
        equals: data.email,
      },
    },
  });

  const emailFromToken = getEmailFromTokenIfValid(user.inviteToken); // used to get sender's email from the invite token

  // check that a valid email is used
  if (emailFromToken != null) {
    const emailFromTokenExists = await prisma.user.findMany({
      where: {
        email: {
          equals: emailFromToken,
        },
      },
    });

    // validation of creating a new user on the server side
    // checks if the email of new user has not been used before,
    // the email token does not point to an invalid email and
    // the email taken from the invite token is an existing email
    if (
      emailExists.length > 0 ||
      emailFromToken == null ||
      emailFromTokenExists.length == 0
    ) {
      // if invalid request to create a new user, for example if token not valid or email used before then send 400 error response
      res.status(400).json({ message: 'Error: Check email entered.' });
    } else {
      // if all validations pass, the code creates a new user in the database and returns a 200 OK response with the created user information
      const createdUser = await prisma.user.create({
        data,
      });

      res.status(200).json(createdUser); // send response containing the created user information
    }
  } else {
    // sends a 400 Bad Request error response with a message indicating an invalid invite token was given
    res.status(400).json({ message: 'Error: Invalid invite token was given.' });
  }
}
