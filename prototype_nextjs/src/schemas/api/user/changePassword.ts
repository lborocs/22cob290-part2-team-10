import { z } from 'zod';

import { passwordSchema } from '~/schemas/signin';

const ChangePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

export default ChangePasswordSchema;
