import { z } from 'zod';

import { PasswordSchema } from '~/schemas/user';

const ChangePasswordSchema = z.object({
  currentPassword: PasswordSchema,
  newPassword: PasswordSchema,
});

export default ChangePasswordSchema;
