import { forwardRef, useState } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';

import {
  type TextAvatar as TextAvatarType,
  getTextAvatarFromStore,
} from '~/lib/textAvatar';

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
  // only show first 3 names
  // split by whitespace: https://stackoverflow.com/a/10346754
  const names = name.split(/[ ]+/, 3);
  const initials = names.map((name) => name[0].toLocaleUpperCase());

  const [textAvatar, setTextAvatar] = useState<TextAvatarType | null>(null);

  // using SWR like useEffect(..., [])
  useSWR(userId, async (userId) => {
    const textAvatar = await getTextAvatarFromStore(userId);

    if (textAvatar) {
      setTextAvatar(textAvatar);
    }
  });

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
      {initials.join('')}
    </span>
  );
});
