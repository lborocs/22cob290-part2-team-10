import { useRouter } from 'next/router';

import NavItem from '~/components/layout/nav/NavItem';

// TODO: MobileNavItem
// TODO: active style
export default function MobileNavItem({
  page,
  handleCloseNavMenu,
  children = page,
}: React.PropsWithChildren<{ page: string, handleCloseNavMenu: () => void }>) {
  const router = useRouter();

  const url = `/${page.toLowerCase()}`;

  const active = router.pathname.startsWith(url);

  return (
    <NavItem
      to={url}
      onClick={() => {
        // TODO?: maybe try and change to button with NextLinkComposed?
        router.push(`/${page.toLowerCase()}`);
        handleCloseNavMenu();
      }}
    >
      {children}
    </NavItem>
  );
}
