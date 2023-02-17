import { forwardRef } from 'react';
import Avatar from '@mui/material/Avatar';
import clsx from 'clsx';
import useSWR from 'swr';

import { getTextAvatarFromStore } from '~/lib/textAvatar';
import { getInitials } from '~/utils';

import styles from '~/styles/TextAvatar.module.css';

export interface TextAvatarProps
  extends React.ComponentPropsWithoutRef<'span'> {
  userId: string;
  name: string;
  size?: string;
}

// TODO?: https://mui.com/material-ui/react-avatar/#main-content
// will defo want to if want to use AvatarGroup

/**
 * This is for any user
 */
export default forwardRef(function TextAvatar(
  { userId, name, size = '40px', className, style, ...props }: TextAvatarProps,
  ref: React.ForwardedRef<HTMLSpanElement>
) {
  const { data: textAvatar } = useSWR(
    ['textAvatar', userId],
    async ([, userId]) => await getTextAvatarFromStore(userId)
  );

  return (
    <span
      className={clsx(styles.textAvatar, className)}
      style={{
        width: size,
        ...(textAvatar && {
          '--avatar-bg': textAvatar['avatar-bg'],
          '--avatar-fg': textAvatar['avatar-fg'],
        }),
        ...style,
      }}
      ref={ref}
      {...props}
    >
      {getInitials(name)}
    </span>
  );
});

/*
          <Avatar
            sx={(theme) => ({
              bgcolor: values['avatar-bg'],
              color: values['avatar-fg'],
            })}
            component="span"
          >
            {getInitials(name)}
          </Avatar>
*/
