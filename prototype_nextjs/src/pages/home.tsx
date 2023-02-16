import { useState } from 'react';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import { unstable_getServerSession } from 'next-auth/next';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';

import prisma from '~/lib/prisma';
import { SidebarType } from '~/components/Layout';
import type { AppPage, SessionUser } from '~/types';
import { authOptions } from '~/pages/api/auth/[...nextauth]';

import styles from '~/styles/home.module.css';

// TODO: HomePage
const HomePage: AppPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const tagList = tags.split(',');

  const [section, setSection] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setDescription('');
    setTags('');
  };

  const handleOpen = (section: string) => {
    setOpen(true);
    setSection(section);
  };

  const handleSubmit = () => {
    if (title.length == 0 || description.length == 0 || tags.length == 0) {
      return;
    }

    setTasks([
      ...tasks,
      {
        id: tasks.length + 1,
        tit: title,
        des: description,
        tags: tagList,
        section,
      },
    ]);
    handleClose();
  };

  return (
    <main>
      <Head>
        <title>Home - Make-It-All</title>
      </Head>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Title"
            id="taskTitle"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Description"
            id="taskDescription"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            multiline
            maxRows={2}
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Tags"
            id="taskTags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Container className={styles.content}>
        <Box sx={{ fontWeight: 'bold' }}>
          <Typography variant="h4" component="div">
            HOME
          </Typography>
        </Box>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                className={styles.cardheader}
                titleTypographyProps={{ fontSize: 20 }}
                title="To Do"
              />

              <CardActions className="d-grid">
                <Button
                  variant="contained"
                  onClick={() => handleOpen('section-1')}
                >
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                className={styles.cardheader}
                titleTypographyProps={{ fontSize: 20 }}
                title="In Progress"
              />

              <CardActions className="d-grid">
                <Button
                  variant="contained"
                  onClick={() => handleOpen('section-2')}
                >
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.card}>
              <CardHeader
                className={styles.cardheader}
                titleTypographyProps={{ fontSize: 20 }}
                title="Code Review"
              />

              <CardActions className="d-grid">
                <Button
                  variant="contained"
                  onClick={() => handleOpen('section-3')}
                >
                  Add Task
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item md={3} xs={12}>
            <Card className={styles.completed}>
              <CardHeader
                className={styles.cardheader}
                titleTypographyProps={{ fontSize: 20 }}
                title="Completed"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
};

HomePage.layout = {
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

  // TODO: get their todo list from prisma

  return {
    props: {
      session,
      user,
    },
  };
}

export default HomePage;
