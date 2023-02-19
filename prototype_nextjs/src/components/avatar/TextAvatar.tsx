import { forwardRef } from 'react';
import Avatar, { type AvatarProps } from '@mui/material/Avatar';
import useSWR from 'swr';

import { getTextAvatarFromStore } from '~/lib/textAvatar';
import { getInitials } from '~/utils';

export interface TextAvatarProps extends AvatarProps<'span'> {
  userId: string;
  name: string;
  size?: string;
}

/**
 * Displays a user's initials in a colored circle.
 * The color is determined by the user's id - it is fetched from the database upon first load.
 * @param userId The user's id
 * @param name The user's name
 * @param size The size of the avatar
 */
export default forwardRef(function TextAvatar(
  { userId, name, size = '40px', sx, ...props }: TextAvatarProps,
  ref: React.ForwardedRef<HTMLSpanElement>
) {
  const { data: textAvatar } = useSWR(
    ['textAvatar', userId],
    async ([, userId]) => await getTextAvatarFromStore(userId)
  );

  return (
    <Avatar
      sx={[
        {
          width: size,
          height: size,
          bgcolor: textAvatar?.['avatar-bg'],
          color: textAvatar?.['avatar-fg'],
          fontSize: 'large',
          display: 'inline-flex',
        },
        // https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      component="span"
      ref={ref}
      {...props}
    >
      {getInitials(name)}
    </Avatar>
  );
});
