import { useEffect } from 'react';

import { type UserInfo } from '~/server/store/users';

import styles from '~/styles/TextAvatar.module.css';

export default function TextAvatar({ user }: { user: UserInfo }) {
  const { fname, lname } = user;

  const firstInitial = fname[0].toUpperCase();
  const lastInitial = lname[0].toUpperCase();

  useEffect(() => {
    getTextAvatarFromLocalStorage();
  }, []);

  return (
    <span className={styles['text-avatar']}>
      {firstInitial}{lastInitial}
    </span>
  );
}

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
