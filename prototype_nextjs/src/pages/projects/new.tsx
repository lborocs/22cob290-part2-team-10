import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { getServerSession } from 'next-auth/next';
import Typography from '@mui/material/Typography';

import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import prisma from '~/lib/prisma';

import { useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';
import hashids from '~/lib/hashids';

const AddProjectPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ data, users }) => {
  const [formData, setFormData] = useState<{ name: string; leaderId: string }>({
    name: '',
    leaderId: '',
  });

  async function addProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch('/api/projects/add-projects', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      await response.json();

      setFormData({ name: '', leaderId: '' });
      window.location.reload();
    } else {
      alert('Failed to add project');
    }
  }

  return (
    <main>
      <Head>
        <title>Add new project - Make-It-All</title>
      </Head>

      <Typography variant="h4" component="h1">
        Add new project:
      </Typography>
      <form onSubmit={addProject}>
        <div>
          <InputLabel id="project_title_input">Enter project title</InputLabel>
          <TextField
            required
            id="project_title_input"
            label="Project title"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <InputLabel id="leader_select">Select project leader</InputLabel>
          <Autocomplete
            id="leader_select"
            options={users}
            getOptionLabel={(user) => user.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select project leader"
                name="leader"
                id="leader_select"
              />
            )}
            value={users.find((user) => user.id === formData.leaderId)}
            onChange={(e, value) =>
              setFormData({ ...formData, leaderId: value ? value.id : '' })
            }
          />
        </div>
        <br />
        <Button variant="contained" type="submit">
          Add project
        </Button>
      </form>
      <br />

      <h2>Projects:</h2>
      <List>
        {data.map((item) => (
          <ListItem disablePadding key={item.id}>
            <ListItemButton
              component="a"
              href={`/projects/${hashids.encode(item.id)}/overview`}
            >
              <ListItemText primary={`${item.name} - ${item.leader.name}`} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </main>
  );
};

AddProjectPage.layout = {
  sidebar: {
    type: SidebarType.PROJECTS,
  },
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

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

export default AddProjectPage;
