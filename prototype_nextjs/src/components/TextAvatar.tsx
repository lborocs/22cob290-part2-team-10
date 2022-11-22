import { forwardRef, useEffect } from 'react';

import { type UserInfo } from '~/server/store/users';

import styles from '~/styles/TextAvatar.module.css';

type TextAvatar = {
  'avatar-bg': string
  'avatar-fg': string
};

function getTextAvatarFromLocalStorage() {
  const textAvatarJson = localStorage.getItem('textAvatar');

  if (textAvatarJson == null) return null;

  const textAvatar = JSON.parse(textAvatarJson) as TextAvatar;

  for (const key in textAvatar) {
    const colour = textAvatar[key as keyof TextAvatar];

    document.documentElement.style.setProperty(`--${key}`, colour);
  }

  return textAvatar;
}

export interface TextAvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  user: UserInfo
  size?: string
}

export default forwardRef(function LoadingButton({
  user,
  size = '40px',
  ...props
}: TextAvatarProps, ref: React.ForwardedRef<HTMLButtonElement>): JSX.Element {
  const { fname, lname } = user;

  const firstInitial = fname[0].toUpperCase();
  const lastInitial = lname[0].toUpperCase();

  useEffect(() => {
    getTextAvatarFromLocalStorage();
  }, []);

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
      {firstInitial}{lastInitial}
    </span>
  );
});
