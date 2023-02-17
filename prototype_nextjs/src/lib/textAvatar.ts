import axios from 'axios';
import type { z } from 'zod';

import type TextAvatarSchema from '~/schemas/user/textAvatar';
import type { ResponseSchema as GetMyTextAvatarResponse } from '~/pages/api/user/get-my-text-avatar';
import type { ResponseSchema as GetTextAvatarResponse } from '~/pages/api/user/get-text-avatar';
import type {
  RequestSchema as ChangeTextAvatarPayload,
  ResponseSchema as ChangeTextAvatarResponse,
} from '~/pages/api/user/change-text-avatar';

export type TextAvatar = z.infer<typeof TextAvatarSchema>;

export const getDefaultTextAvatar = () => ({
  'avatar-bg': '#e2ba39',
  'avatar-fg': '#ffffff',
});

export async function getMyTextAvatarFromStore(): Promise<TextAvatar> {
  const { data } = await axios.get<GetMyTextAvatarResponse>(
    '/api/user/get-my-text-avatar'
  );
  return data;
}

export async function getTextAvatarFromStore(
  userId: string
): Promise<TextAvatar | null> {
  const { data } = await axios.get<GetTextAvatarResponse>(
    `/api/user/get-text-avatar?userId=${encodeURIComponent(userId)}`
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
