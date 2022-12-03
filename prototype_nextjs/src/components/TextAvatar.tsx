import { forwardRef, useEffect } from 'react';

import useUserStore from '~/store/userStore';

import styles from '~/styles/TextAvatar.module.css';

export type TextAvatar = {
  'avatar-bg': string
  'avatar-fg': string
};

export const getDefaultTextAvatar = () => ({
  'avatar-bg': '#e2ba39',
  'avatar-fg': '#ffffff',
});

// TODO: use database
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

  useEffect(() => {
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
      {initials.join('')}
    </span>
  );
});
