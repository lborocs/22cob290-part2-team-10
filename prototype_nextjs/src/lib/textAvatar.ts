import axios from 'axios';
import type { z } from 'zod';

import type TextAvatarSchema from '~/schemas/user/textAvatar';
import type { ResponseSchema as GetTextAvatarResponse } from '~/pages/api/user/get-my-text-avatar';
import type {
  RequestSchema as ChangeTextAvatarPayload,
  ResponseSchema as ChangeTextAvatarResponse,
} from '~/pages/api/user/change-text-avatar';

export type TextAvatar = z.infer<typeof TextAvatarSchema>;

export const getDefaultTextAvatar = () => ({
  'avatar-bg': '#e2ba39',
  'avatar-fg': '#ffffff',
});

export async function getTextAvatarFromStore(): Promise<TextAvatar> {
  const { data } = await axios.get<GetTextAvatarResponse>(
    '/api/user/get-my-text-avatar'
  );
  return data;
}

export async function updateTextAvatarStore(
  textAvatar: TextAvatar
): Promise<boolean> {
  const payload: ChangeTextAvatarPayload = textAvatar;

  const { data } = await axios.post<ChangeTextAvatarResponse>(
    '/api/user/change-text-avatar',
    payload
  );

  return data.success;
}

export function getTextAvatarFromCss(): TextAvatar {
  return {
    'avatar-bg': document.documentElement.style.getPropertyValue('--avatar-bg'),
    'avatar-fg': document.documentElement.style.getPropertyValue('--avatar-fg'),
  };
}

export function updateTextAvatarCss(textAvatar: TextAvatar) {
  for (const key in textAvatar) {
    const colour = textAvatar[key as keyof TextAvatar];

    document.documentElement.style.setProperty(`--${key}`, colour);
  }
}
