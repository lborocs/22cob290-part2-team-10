import { z } from 'zod';

import { nameSchema, EmailSchema, PasswordSchema } from '~/schemas/user';

/*
Schema used to validate formik form used when a new employee account is being
created.
*/

const SignUpSchema = z.object({
  name: nameSchema(),
  email: EmailSchema,
  password: PasswordSchema,
  inviteToken: z.string(),
});

export default SignUpSchema;
