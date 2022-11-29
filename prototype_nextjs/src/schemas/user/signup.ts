import { z } from 'zod';

import { nameSchema, EmailSchema, PasswordSchema } from '~/schemas/user';

const SignUpSchema = z.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
  email: EmailSchema,
  password: PasswordSchema,
  token: z.string(),
});

export default SignUpSchema;
