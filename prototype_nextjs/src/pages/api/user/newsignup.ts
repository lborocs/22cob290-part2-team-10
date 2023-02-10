import { PrismaClient } from '@prisma/client';
// import { ok } from 'assert';

import { hashPassword } from '~/lib/user';

const prisma = new PrismaClient();

export default async (req, res) => {
  const data = JSON.parse(req.body);
  const hashedPassword = hashPassword.bind(null, data['password']);
  data['hashedPassword'] = await hashedPassword();
  delete data['password'];
  // console.log(data);

  const sameEmail = await prisma.user.findMany({
    where: {
      email: {
        equals: data['email'],
      },
    },
  });

  if (sameEmail.length > 0) {
    res.json(400);
  } else {
    const createdUser = await prisma.user.create({
      data,
    });
    res.json(createdUser);
    // res.json(400);
  }
};
