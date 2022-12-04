import { z } from 'zod';

import { nameSchema, EmailSchema, PasswordSchema } from '~/schemas/user';

const SignUpSchema = z.object({
  name: nameSchema(),
  email: EmailSchema,
  password: PasswordSchema,
  token: z.string(),
});

export default SignUpSchema;
