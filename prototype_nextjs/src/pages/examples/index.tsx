import Head from 'next/head';
import Link from 'next/link';
import ListGroup from 'react-bootstrap/ListGroup';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NextLinkComposed } from '~/components/Link';
import ThemeSwitcher from '~/components/layout/ThemeSwitcher';

import 'bootstrap/dist/css/bootstrap.min.css';

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
        elevation={3}
        sx={(theme) => ({
          bgcolor: theme.palette.mode === 'dark' ? undefined : 'white',
          marginTop: 2,
        })}
      >
        <List>
          <section>
            <List
              subheader={
                <ListSubheader
                  sx={(theme) => ({
                    bgcolor: theme.palette.mode === 'dark' ? undefined : 'white',
                  })}
                >
                  <Typography variant="h4" component="h2">
                    Template
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItem
                sx={(theme) => ({
                  display: 'list-item',
                  listStyleType: 'disc',
                  ml: 4,
                  pl: 0,
                  width: `calc(100% - ${theme.spacing(4)})`,
                })}
              >
                <ListItemButton
                  component={NextLinkComposed}
                  to="/examples/page_template"
                >
                  <ListItemText>Page template (you copy and paste the code)</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </section>
          <section>
            {/* TODO: Page section */}
          </section>
          <section>
            {/* TODO: Sidebar section */}
          </section>
        </List>

      </Paper >
      <ListGroup as="ul">
        <ListGroup.Item as="li">
          <section>
            <h2>Template</h2>
            <ul>
              <li><Link href="/examples/page_template">Page template (you copy and paste the code)</Link></li>
            </ul>
          </section>
        </ListGroup.Item>

        <ListGroup.Item as="li">
          <section>
            <h2>Page</h2>
            <ul>
              <li><Link href="/examples/user_ssr">
                Getting user from <code>user</code> prop from SSR <small><strong>(not recommended)</strong></small>
              </Link></li>
            </ul>
            <ul>
              <li><Link href="/examples/user_userstore">
                Getting user from <code>userStore</code> <small><strong>(recommended)</strong></small>
              </Link></li>
            </ul>
          </section>
        </ListGroup.Item>

        <ListGroup.Item as="li">
          <section>
            <h2>Sidebar</h2>
            <ListGroup as="ol" numbered>
              <ListGroup.Item as="li">
                <Link href="/examples/projects_sidebar">Projects sidebar</Link>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <Link href="/examples/custom_sidebar">Custom sidebar</Link>
              </ListGroup.Item>
              <ListGroup.Item as="li">
                <Link href="/examples/no_sidebar">No sidebar (with title)</Link>
              </ListGroup.Item>
            </ListGroup>
          </section>
        </ListGroup.Item>
      </ListGroup>
    </Stack>
  );
}

ExamplesPage.noAuth = true;
