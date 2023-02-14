import { z } from 'zod';

import { nameSchema, EmailSchema, PasswordSchema } from '~/schemas/user';

const SignUpSchema = z.object({
  name: nameSchema(),
  email: EmailSchema,
  password: PasswordSchema,
  inviteToken: z.string(),
});

export default SignUpSchema;
