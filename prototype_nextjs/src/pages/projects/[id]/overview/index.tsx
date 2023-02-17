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
import { useRouter } from 'next/router';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Autocomplete from '@mui/material/Autocomplete';

// TODO: project page (Projects page from before)
const overviewPage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ project, users, usersInProject }) => {
  if (!project) {
    return <ErrorPage statusCode={404} title="Project not found" />;
  }

  const [formData, setFormData] = useState({
    newLeader: null,
  });
  const pageTitle = `${project?.name ?? 'Project'} - Make-It-All`;
  const [title, setTitle] = useState(project.name);

  const router = useRouter();

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

  async function changeProjectLeader(e: { preventDefault: () => void }) {
    e.preventDefault();
    const newLeaderId = formData.newLeader.id;
    const response = await fetch(`/api/projects/${project.id}/changeLeader`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newLeaderId }),
    });
    if (response.ok) {
      // Reload the page to reflect the changes
      window.location.reload();
    } else {
      // Handle error
      console.log('Failed to change project leader');
    }
  }

  const updateProjectTitle = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `/api/projects/${project.id}/updateProjectTitle`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      }
    );

    if (response.ok) {
      // Reload the page to reflect the changes
      window.location.reload();
    } else {
      // Handle error
      console.log('Failed to update project title');
    }
  };

  async function deleteProject() {
    const response = await fetch(`/api/projects/${project.id}/delete`, {
      method: 'DELETE',
    });
    if (response.ok) {
      // Redirect to projects page
      router.push('/projects');
    } else {
      // Handle error
      console.log('Failed to delete project');
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
        <br></br>
        <h2>Edit project:</h2>
        <form onSubmit={updateProjectTitle}>
          <TextField
            label="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Update Title
          </Button>
        </form>

        <form onSubmit={addMemberToProject}>
          <div>
            <InputLabel id="emp_select_label">
              Assign Employee to project
            </InputLabel>
            <Autocomplete
              required
              options={users}
              getOptionLabel={(user) => user.name}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Assign Employee to project"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password',
                  }}
                />
              )}
              onChange={(event, newValue) => {
                setFormData({ ...formData, memberId: newValue?.id });
              }}
            />
          </div>

          <br></br>
          <Button variant="contained" type="submit">
            Add employee
          </Button>
        </form>

        <form onSubmit={changeProjectLeader}>
          <Autocomplete
            id="leader_select"
            options={usersInProject}
            getOptionLabel={(user) => user.name}
            value={formData.newLeader}
            onChange={(_, newValue) =>
              setFormData({ ...formData, newLeader: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select new leader"
                variant="standard"
              />
            )}
          />
          <br />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Change leader
          </Button>
        </form>

        <Button variant="contained" color="secondary" onClick={deleteProject}>
          Delete Project
        </Button>
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

  const projectId = decodedId[0] as number | undefined;

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

  const usersInProject = project.members.filter(
    (member) => member.id !== project.leaderId
  );
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: project.leaderId,
      },
      NOT: {
        id: { in: project.members.map((member) => member.id) },
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
      usersInProject, // exclude leader from list of members
      users,
    },
  };
}

export default overviewPage;
