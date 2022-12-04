import { z } from 'zod';

const TextAvatarSchema = z.object({
  'avatar-bg': z.string(),
  'avatar-fg': z.string(),
});

export default TextAvatarSchema;
