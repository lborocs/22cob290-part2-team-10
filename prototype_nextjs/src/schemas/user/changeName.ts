import { z } from 'zod';

import { nameSchema } from '~/schemas/user';

const ChangeNameSchema = z.object({
  firstName: nameSchema('First name'),
  lastName: nameSchema('Last name'),
});

export default ChangeNameSchema;
