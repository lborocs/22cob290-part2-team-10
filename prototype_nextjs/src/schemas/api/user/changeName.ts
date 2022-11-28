import { z } from 'zod';

const ChangeNameSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
});

export default ChangeNameSchema;
