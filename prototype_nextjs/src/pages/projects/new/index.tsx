import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Typography from '@mui/material/Typography';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import { PrismaClient } from '@prisma/client';
import prisma from '~/lib/prisma';

import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';

const addProjectPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data, users }) => {
  const [formData, setFormData] = useState({});

  async function addProject(e: { preventDefault: () => void }) {
    e.preventDefault();
    const response = await fetch('/api/projects/add-projects', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    window.location.reload();
    return await response.json();
  }

  return (
    <main>
      <Head>
        <title>Add new project</title>
      </Head>

      <body>
        <Typography variant="h4" component="h1">
          New project
        </Typography>
        <form onSubmit={addProject}>
          <div>
            <InputLabel id="project_title_input">
              Enter project title
            </InputLabel>
            <TextField
              required
              id="project_title_input"
              label="Project title"
              type="text"
              name="name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <InputLabel id="leader_select">Select project leader</InputLabel>
            <Select
              required
              id="leader_select"
              name="leader"
              onChange={(e) =>
                setFormData({ ...formData, leaderId: e.target.value })
              }
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <br></br>
          <Button variant="contained" type="submit">
            Add project
          </Button>
        </form>

        <List>
          {data.map((item) => (
            <ListItem disablePadding>
              <ListItemButton
                component="a"
                href={'/projects/[' + item.id + ']/overview'}
              >
                <ListItemText primary={item.name + ' - ' + item.leader.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </body>
    </main>
  );
};

addProjectPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user) {
    return { notFound: true };
  }

  const user = session.user as SessionUser;

  const projects = await prisma.project.findMany({
    include: {
      leader: true,
    },
  });

  const users = await prisma.user.findMany();

  return {
    props: {
      session,
      user,
      data: projects,
      users,
    },
  };
}

export default addProjectPage;
