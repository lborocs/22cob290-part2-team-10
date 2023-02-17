import Avatar, { type AvatarProps } from '@mui/material/Avatar';

import { getInitials } from '~/utils';
import TextAvatar from '~/components/avatar/TextAvatar';

export type UserAvatarProps = AvatarProps<'span'> & {
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
  sx,
  ...props
}: UserAvatarProps) {
  // TODO: remove this placeholder
  // if (image === null)
  //   image =
  //     'https://www.shutterstock.com/image-photo/barcelona-feb-23-lionel-messi-260nw-1900547713.jpg';

  return image ? (
    <Avatar
      alt={name}
      src={image}
      sx={[
        {
          width: size,
          height: size,
        },
        // https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      component="span"
      {...props}
    >
      {getInitials(name)}
    </Avatar>
  ) : (
    <TextAvatar userId={userId} name={name} size={size} sx={sx} {...props} />
  );
}
