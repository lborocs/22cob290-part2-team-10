import { Avatar } from '@mui/material';

import TextAvatar from '~/components/avatar/TextAvatar';

export type UserAvatarProps = React.ComponentPropsWithRef<'span'> & {
  userId: string;
  name: string;
  image: string | null;
  size?: string;
};

export default function UserAvatar({
  userId,
  name,
  image,
  size = '40px',
  ...props
}: UserAvatarProps) {
  // TODO: remove this placeholder
  if (image === null)
    image =
      'https://www.shutterstock.com/image-photo/barcelona-feb-23-lionel-messi-260nw-1900547713.jpg';

  return image ? (
    <Avatar
      alt={name}
      src={image}
      sx={{
        width: size,
        height: size,
      }}
      component="span"
      {...props}
    />
  ) : (
    <TextAvatar userId={userId} name={name} size={size} {...props} />
  );
}
