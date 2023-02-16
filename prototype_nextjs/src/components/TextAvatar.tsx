import { forwardRef } from 'react';
import clsx from 'clsx';
import useSWR from 'swr';

import {
  getMyTextAvatarFromStore,
  updateTextAvatarCss,
} from '~/lib/textAvatar';
import useUserStore from '~/store/userStore';

import styles from '~/styles/TextAvatar.module.css';

export interface TextAvatarProps
  extends React.ComponentPropsWithoutRef<'span'> {
  size?: string;
}

// TODO: https://mui.com/material-ui/react-avatar/#main-content
/**
 * This is only for the signed in user
 */
export default forwardRef(function TextAvatar(
  { size = '40px', className, style, ...props }: TextAvatarProps,
  ref: React.ForwardedRef<HTMLSpanElement>
) {
  const username = useUserStore((state) => state.user.name);

  // only show first 3 names
  // split by whitespace: https://stackoverflow.com/a/10346754
  const names = username.split(/[ ]+/, 3);
  const initials = names.map((name) => name[0].toLocaleUpperCase());

  // using SWR like useEffect(..., [])
  useSWR('textAvatar', async () => {
    const textAvatar = await getMyTextAvatarFromStore();

    updateTextAvatarCss(textAvatar);
  });

  return (
    <span
      className={clsx(styles.textAvatar, className)}
      style={{
        width: size,
        ...style,
      }}
      ref={ref}
      {...props}
    >
      {initials.join('')}
    </span>
  );
});
