import useUserStore from '~/store/userStore';
import UserAvatar, {
  type UserAvatarProps,
} from '~/components/avatar/UserAvatar';

export type SignedInUserAvatar = Omit<
  UserAvatarProps,
  'userId' | 'name' | 'image'
>;

export default function SignedInUserAvatar(props: SignedInUserAvatar) {
  const { id, name, image } = useUserStore((state) => state.user);

  return <UserAvatar userId={id} name={name} image={image} {...props} />;
}
