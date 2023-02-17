import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';

import hashids from '~/lib/hashids';
import prisma from '~/lib/prisma';
import ErrorPage from '~/components/ErrorPage';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

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

// TODO: project page (Projects page from before)
const overviewPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project, users, usersInProject }) => {
  if (!project) {
    return <ErrorPage statusCode={404} title="Project not found" />;
  }

  const [formData, setFormData] = useState({});
  const pageTitle = `${project.name} - Make-It-All`;

  async function addMemberToProject(e: { preventDefault: () => void }) {
    e.preventDefault();
    const { memberId, leaderId } = formData;
    const response = await fetch(`/api/projects/${project.id}/addMember`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, leaderId }),
    });
    if (response.ok) {
      // Reload the page to reflect the changes
      window.location.reload();
    } else {
      // Handle error
      console.log('Failed to add member to project');
    }
  }

  async function removeMemberFromProject(memberId: string) {
    const response = await fetch(`/api/projects/${project.id}/removeMember`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId }),
    });
    if (response.ok) {
      // Reload the page to reflect the changes
      window.location.reload();
    } else {
      // Handle error
      console.log('Failed to remove member from project');
    }
  }

  return (
    <main>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <body>
        <h1>
          {project.name}{' '}
          <span style={{ color: 'red' }}>: {project.leader.name}</span>
        </h1>
        <h2>Team members:</h2>
        {usersInProject.map((user) => (
          <div key={user.id}>
            <p>
              -{user.name}{' '}
              <button onClick={() => removeMemberFromProject(user.id)}>
                Remove
              </button>
            </p>
          </div>
        ))}

        <form onSubmit={addMemberToProject}>
          <div>
            <InputLabel id="emp_select_label">
              Assign Employee to project
            </InputLabel>
            <Select
              required
              id="emp_select"
              onChange={(e) =>
                setFormData({ ...formData, memberId: e.target.value })
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
            Add employee
          </Button>
        </form>
      </body>
    </main>
  );
};

overviewPage.layout = {
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

  const { id } = context.params!;
  const decodedId = hashids.decode(id as string);
  console.log(decodedId);
  const projectId = decodedId[0] as number | undefined;
  console.log(projectId);
  console.log('id =', id);
  if (!projectId) {
    return { notFound: true };
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      leader: true,
      members: true,
    },
  });

  const usersInProject = project.members;
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: project.leaderId,
      },
    },
  });

  if (!project) {
    return { notFound: true };
  }

  return {
    props: {
      session,
      user,
      project,
      usersInProject,
      users,
    },
  };
}

export default overviewPage;
