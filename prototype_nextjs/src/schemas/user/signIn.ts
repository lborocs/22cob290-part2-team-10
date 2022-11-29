import { z } from 'zod';

import { EmailSchema, PasswordSchema } from '~/schemas/user';

const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export default SignInSchema;
