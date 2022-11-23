import { forwardRef, useEffect } from 'react';

import { type UserInfo } from '~/types';

import styles from '~/styles/TextAvatar.module.css';

export type TextAvatar = {
  'avatar-bg': string
  'avatar-fg': string
};

export const getDefaultTextAvatar = () => ({
  'avatar-bg': '#e2ba39',
  'avatar-fg': '#ffffff',
});

// localStorage acting as our store
export function getTextAvatarFromStore(): TextAvatar {
  const textAvatarJson = localStorage.getItem('textAvatar');

  if (textAvatarJson == null) return getDefaultTextAvatar();

  return JSON.parse(textAvatarJson) as TextAvatar;
}

export function updateTextAvatarStore(textAvatar: TextAvatar) {
  localStorage.setItem('textAvatar', JSON.stringify(textAvatar));
}

export function updateTextAvatarCss(textAvatar: TextAvatar) {
  for (const key in textAvatar) {
    const colour = textAvatar[key as keyof TextAvatar];

    document.documentElement.style.setProperty(`--${key}`, colour);
  }
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
    // localStorage acting as our store
    const textAvatar = getTextAvatarFromStore();
    updateTextAvatarCss(textAvatar);
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
