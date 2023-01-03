import type { CSSProperties } from 'react';
import Head from 'next/head';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import List, { type ListProps } from '@mui/material/List';
import ListSubheader, { type ListSubheaderProps } from '@mui/material/ListSubheader';
import ListItem, { type ListItemProps } from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';
import ThemeSwitcher from '~/components/ThemeSwitcher';

const ExampleList = ({
  header,
  listStyle = 'disc',
  ...props
}: ListProps & { header: React.ReactNode, listStyle?: CSSProperties['listStyle'] }
) => (
  <List
    subheader={<StyledListSubheader>{header}</StyledListSubheader>}
    dense
    disablePadding
    sx={{
      listStyle,
    }}
    {...props}
  />
);

const StyledListSubheader = ({ children, ...props }: ListSubheaderProps) => (
  <ListSubheader {...props}>
    <Typography variant="h5" component="h2" paddingY={0.5}>
      {children}
    </Typography>
  </ListSubheader>
);

const BulletListItemLink = ({
  href,
  children,
  ...props
}: ListItemProps & { href: string }) => (
  <ListItem
    sx={{
      display: 'list-item',
      ml: 4,
      pl: 0,
    }}
    {...props}
  >
    <ListItemButton
      component={NextLinkComposed}
      to={href}
    >
      <ListItemText>
        <MuiLink component="span"
        // only using MuiLink for styling
        >
          {children}
        </MuiLink>
      </ListItemText>
    </ListItemButton>
  </ListItem>
);

export default function ExamplesPage() {
  return (
    <Stack
      height="100vh"
      alignItems="center"
      justifyContent="center"
      component="main"
    >
      <Head>
        <title>Examples</title>
      </Head>

      <ThemeSwitcher />

      <Typography variant="h3" component="h1">
        Examples
      </Typography>
      <Typography variant="caption">
        {'Note: You need to be signed in (it\'ll redirect you to the sign in page)'}
      </Typography>

      <Paper
        elevation={4}
        sx={{
          marginTop: 2,
          p: 2,
        }}
      >
        <nav>
          <List
            dense
            component={Stack}
            divider={<Divider />}
            spacing={1}
          >
            <section>
              <ExampleList header="Template">
                <BulletListItemLink href="/examples/page_template">
                  Page template (you copy and paste the code)
                </BulletListItemLink>
              </ExampleList>
            </section>

            <section>
              <ExampleList header="User">
                <BulletListItemLink href="/examples/user_ssr">
                  Getting user from <code>user</code> prop from SSR <small><strong>(not recommended)</strong></small>
                </BulletListItemLink>
                <BulletListItemLink href="/examples/user_userstore">
                  Getting user from <code>userStore</code> <small><strong>(recommended)</strong></small>
                </BulletListItemLink>
              </ExampleList>
            </section>

            <section>
              <ExampleList
                header="Sidebar"
                listStyle="decimal"
                // @ts-expect-error cba to properly configure prop type of ExampleList
                component="ol"
                start={0}
              >
                <BulletListItemLink href="/examples/projects_sidebar">
                  Projects sidebar
                </BulletListItemLink>
                <BulletListItemLink href="/examples/custom_sidebar">
                  Custom sidebar
                </BulletListItemLink>
                <BulletListItemLink href="/examples/no_sidebar">
                  No sidebar
                </BulletListItemLink>
              </ExampleList>
            </section>
          </List>
        </nav>
      </Paper>
    </Stack>
  );
}

ExamplesPage.noAuth = true;
