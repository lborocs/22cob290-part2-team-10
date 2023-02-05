import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import { NextLinkComposed } from '~/components/Link';
import type { PageData } from '~/components/layout/NavigationBar';
import { extractPathname } from '~/utils';

export type NavCollapseProps = {
  pages: PageData[];
  open: boolean;
  closeCollapse(): void;
  collapseId: string;
};

/**
 * Navigation for smaller-than-desktop screens (below `lg` breakpoint).
 *
 * @param pages
 * @param open
 * @param closeCollapse
 * @param collapseId
 */
export default function NavCollapse({
  pages,
  open,
  closeCollapse,
  collapseId,
}: NavCollapseProps) {
  const router = useRouter();

  const isActive = (pageHref: PageData['href']): boolean => {
    return extractPathname(pageHref) === router.pathname;
  };

  return (
    <Collapse
      in={open}
      id={collapseId}
      collapsedSize={0}
      easing="ease"
      timeout={350}
      sx={{
        display: { xs: 'block', lg: 'none' },
      }}
    >
      <List
        sx={{
          paddingTop: 0,
        }}
        onClick={closeCollapse}
      >
        {pages.map((page) => (
          <ListItem
            key={extractPathname(page.href)}
            sx={{
              color: isActive(page.href) ? 'primary.main' : undefined,
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <Box
              width={1}
              height={1}
              component={NextLinkComposed}
              to={page.href}
            >
              {page.label}
            </Box>
          </ListItem>
        ))}
      </List>
    </Collapse>
  );
}
