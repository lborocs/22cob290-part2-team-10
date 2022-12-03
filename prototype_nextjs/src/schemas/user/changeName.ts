import { z } from 'zod';

import { nameSchema } from '~/schemas/user';

const ChangeNameSchema = z.object({
  name: nameSchema('Name'),
});

export default ChangeNameSchema;
