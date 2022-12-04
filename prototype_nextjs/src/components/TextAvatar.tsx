import { forwardRef } from 'react';
import useSWR from 'swr';

import { getTextAvatarFromStore, updateTextAvatarCss } from '~/lib/textAvatar';
import useUserStore from '~/store/userStore';

import styles from '~/styles/TextAvatar.module.css';

export interface TextAvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  size?: string
}

export default forwardRef(function LoadingButton({
  size = '40px',
  ...props
}: TextAvatarProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  const username = useUserStore((state) => state.user.name);

  // only show first 3 names
  // split by whitespace: https://stackoverflow.com/a/10346754
  const names = username.split(/[ ]+/, 3);
  const initials = names.map((name) => name[0].toLocaleUpperCase());

  // using SWR like useEffect(..., [])
  useSWR('textAvatar', async () => {
    const textAvatar = await getTextAvatarFromStore();

    updateTextAvatarCss(textAvatar);
  });

  const {
    className,
    style,
    ...passedProps
  } = props;

  return (
    <span
      className={`${styles['text-avatar']} ${className ?? ''}`}
      style={{
        width: size,
        lineHeight: size,
        ...style,
      }}
      ref={ref}
      {...passedProps}
    >
      {initials.join('')}
    </span>
  );
});
