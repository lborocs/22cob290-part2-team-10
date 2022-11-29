import { z } from 'zod';

// name regex: https://stackoverflow.com/a/36733683
const ChangeNameSchema = z.object({
  firstName: z.string()
    .regex(/^[a-z]+$/i, 'First name is alphabetic only')
    .min(1, 'First name is required'),
  lastName: z.string()
    .regex(/^[a-z]+$/i, 'Last name is alphabetic only')
    .min(1, 'Last name is required'),
});

export default ChangeNameSchema;
