import { z } from 'zod';

// URL or empty string
const ChangeImageSchema = z.object({
  image: z.string().url().max(150).or(z.string().max(0)),
});

export default ChangeImageSchema;
